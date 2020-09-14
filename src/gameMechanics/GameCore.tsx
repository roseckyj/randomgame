import React from 'react';

import '@babylonjs/core/Physics/physicsEngineComponent';
import babylonjs, { Vector3, UniversalCamera } from '@babylonjs/core';
import { Scene, Engine, SceneEventArgs } from 'react-babylonjs';

import { AdvancedDynamicTexture } from '@babylonjs/gui/2D/advancedDynamicTexture';
import { Player } from './gameObjects/Player';
import { Chunk } from './gameObjects/Chunk';
import { GameScene } from './Scene';
import { CONTROLS_WASD } from '../keyBindings';
import { NetworkClient } from './network/NetworkClient';

const Z_DISTANCE = 1000;
const RENDER_DISTANCE = 1;

interface IGameCoreProps {
    apiUrl: string;
}

interface IGameCoreState {}

export class GameCore extends React.Component<IGameCoreProps, IGameCoreState> {
    gameScene: GameScene;
    me: Player | null = null;

    babylonScene: babylonjs.Scene | null;
    networkClient: NetworkClient;
    state: IGameCoreState = {};

    timer: NodeJS.Timeout;

    constructor(props: IGameCoreProps) {
        super(props);

        this.gameScene = new GameScene();
        this.networkClient = new NetworkClient(this.props.apiUrl, this.gameScene, () => this.babylonScene!);
        this.networkClient.on('authenticated', (data: { id: string }) => this.initGame(data.id));

        document.addEventListener('keydown', (event) => {
            if (this.me) {
                this.me.keyDown(event.keyCode);
            }
        });

        document.addEventListener('keyup', (event) => {
            if (this.me) {
                this.me.keyUp(event.keyCode);
            }
        });

        window.addEventListener('resize', (event) => {
            this.resize();
        });
    }

    componentDidMount() {
        this.resize();
        this.networkClient.open();
    }

    componentWillUnmount() {
        clearInterval(this.timer);
        this.networkClient.close();
    }

    initGame(id: string) {
        this.me = new Player(id);
        this.me.attachBabylon(this.babylonScene!);
        this.me.bindKeys(CONTROLS_WASD);
        this.gameScene.players.add(id, this.me);

        this.timer = setInterval(() => {
            if (this.me) this.networkClient.sendPlayerUpdate(this.me);
        }, 100);
    }

    tick(deltaTime: number) {
        this.gameScene.players.forEach((player) => player.tick(deltaTime));

        this.gameScene.chunks.forEach((chunk) => chunk.setVisibility(false));

        if (this.me) {
            for (let x = -RENDER_DISTANCE; x <= RENDER_DISTANCE; x++) {
                for (let y = -RENDER_DISTANCE; y <= RENDER_DISTANCE; y++) {
                    const chunkX = Math.round(this.me.position.x / 1600) + x;
                    const chunkY = Math.round(this.me.position.y / 1600) + y;
                    const chunkId = Chunk.getId(chunkX, chunkY);

                    if (this.gameScene.chunks.includes(chunkId)) {
                        this.gameScene.chunks.get(chunkId).setVisibility(true);
                    } else {
                        this.networkClient.requestChunk(chunkX, chunkY);
                        this.gameScene.chunks.add(chunkId, new Chunk(chunkX, chunkY).attachBabylon(this.babylonScene!));
                    }
                }
            }
        }
    }

    resize() {
        const canvas = document.getElementById('game') as HTMLCanvasElement;
        if (canvas) {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
    }

    onSceneMount(event: SceneEventArgs) {
        const { scene } = event;

        this.babylonScene = scene;

        const camera = new UniversalCamera('Camera', new Vector3(0, 0, Z_DISTANCE), scene);
        camera.rotation = new Vector3(0, 0, 0);
        //camera.attachControl(event.canvas, true);

        const guiTexture = AdvancedDynamicTexture.CreateFullscreenUI('GUI', true, scene);

        scene.getEngine().runRenderLoop(() => {
            this.tick(scene.getEngine().getDeltaTime());

            const gui = guiTexture.getContext();
            gui.clearRect(0, 0, guiTexture.getSize().width, guiTexture.getSize().height);
            gui.fillText(
                this.me
                    ? Math.round(this.me.position.x / 100) + ' × ' + Math.round(this.me.position.y / 100)
                    : 'Not connected...',
                20,
                30,
            );
            guiTexture.update();

            if (this.me) {
                camera.position = new Vector3(this.me.position.x, -this.me.position.y, -Z_DISTANCE);
            }

            if (scene) {
                scene.render();
            }
        });
    }

    render() {
        return (
            <>
                <Engine antialias={true} canvasId="game">
                    <Scene onSceneMount={(event) => this.onSceneMount(event)}>
                        <></>
                    </Scene>
                </Engine>
            </>
        );
    }
}

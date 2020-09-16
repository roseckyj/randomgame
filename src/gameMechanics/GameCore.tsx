import React from 'react';

import '@babylonjs/core/Physics/physicsEngineComponent';
import babylonjs, { Vector3, UniversalCamera } from '@babylonjs/core';
import { Scene, Engine, SceneEventArgs } from 'react-babylonjs';

import { AdvancedDynamicTexture } from '@babylonjs/gui/2D/advancedDynamicTexture';
import { Player } from './gameObjects/Player';
import { Chunk } from './gameObjects/Chunk';
import { GameScene } from './gameObjects/Scene';
import { CONTROLS_WASD } from '../keyBindings';
import { NetworkClient } from './network/Client';
import { minimap } from './gui/minimap';

const Z_DISTANCE = 1500;
const RENDER_DISTANCE = 3;
const REQUEST_DISTANCE = 3;
const DELETE_DISTANCE = 5;

interface IGameCoreProps {
    apiUrl: string;
}

interface IGameCoreState {}

export class GameCore extends React.Component<IGameCoreProps, IGameCoreState> {
    gameScene: GameScene;
    me: Player | null = null;

    babylonScene: babylonjs.Scene | null;
    guiTexture: AdvancedDynamicTexture | null;
    networkClient: NetworkClient;
    state: IGameCoreState = {};

    timer: NodeJS.Timeout;

    zoom: number = 1;

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

        document.addEventListener('wheel', (event) => {
            event.preventDefault();

            this.zoom += event.deltaY * 0.03;
            if (this.zoom < 0.5) this.zoom = 0.5;
            if (this.zoom > 3) this.zoom = 3;
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
        this.me = new Player(this.gameScene, id);
        this.me.attachBabylon(this.babylonScene!);
        this.me.bindKeys(CONTROLS_WASD);
        this.gameScene.players.add(id, this.me);

        (window as any).player = this.me;
        (window as any).scene = this.gameScene;

        this.timer = setInterval(() => {
            if (this.me) this.networkClient.sendPlayerUpdate(this.me);
        }, 100);
    }

    tick(deltaTime: number) {
        this.gameScene.players.forEach((player) => player.tick(deltaTime));

        this.gameScene.chunks.forEach((chunk) => {
            if (
                this.me &&
                (Math.abs(Math.round(this.me.position.x / 1600) - chunk.position.x) > RENDER_DISTANCE ||
                    Math.abs(Math.round(this.me.position.y / 1600) - chunk.position.y) > RENDER_DISTANCE)
            ) {
                chunk.setVisibility(false);
                if (
                    this.me &&
                    (Math.abs(Math.round(this.me.position.x / 1600) - chunk.position.x) > DELETE_DISTANCE ||
                        Math.abs(Math.round(this.me.position.y / 1600) - chunk.position.y) > DELETE_DISTANCE)
                ) {
                    this.gameScene.chunks.remove(chunk.id);
                }
            } else {
                chunk.setVisibility(true);
            }
        });
        if (this.guiTexture) {
            if (this.me) {
                for (let x = -REQUEST_DISTANCE; x <= REQUEST_DISTANCE; x++) {
                    for (let y = -REQUEST_DISTANCE; y <= REQUEST_DISTANCE; y++) {
                        const chunkX = Math.round(this.me.position.x / 1600) + x;
                        const chunkY = Math.round(this.me.position.y / 1600) + y;
                        const chunkId = Chunk.getId(chunkX, chunkY);

                        if (!this.gameScene.chunks.includes(chunkId)) {
                            this.networkClient.requestChunk(chunkX, chunkY);
                            this.gameScene.chunks.add(
                                chunkId,
                                new Chunk(this.gameScene, chunkX, chunkY).attachBabylon(this.babylonScene!),
                            );
                        }
                    }
                }

                const gui = this.guiTexture.getContext();
                const width = this.guiTexture.getSize().width;
                const height = this.guiTexture.getSize().height;
                gui.clearRect(0, 0, width, height);

                minimap(this.guiTexture, this.gameScene, this.me);

                this.guiTexture.update();
            } else {
                const gui = this.guiTexture.getContext();
                const width = this.guiTexture.getSize().width;
                const height = this.guiTexture.getSize().height;
                gui.clearRect(0, 0, width, height);

                gui.fillStyle = '#FFFFFF';
                gui.font = '20px pixel';
                gui.textBaseline = 'middle';
                gui.textAlign = 'center';

                gui.fillText(
                    'Connecting to server...',
                    width / 2,
                    height / 2,
                );

                this.guiTexture.update();
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

        this.guiTexture = AdvancedDynamicTexture.CreateFullscreenUI('GUI', true, scene);

        scene.getEngine().runRenderLoop(() => {
            this.tick(scene.getEngine().getDeltaTime());

            if (this.me) {
                camera.position = new Vector3(this.me.position.x, -this.me.position.y, -Z_DISTANCE * this.zoom);
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
                    <Scene onSceneMount={(event: SceneEventArgs) => this.onSceneMount(event)}>
                        <></>
                    </Scene>
                </Engine>
            </>
        );
    }
}

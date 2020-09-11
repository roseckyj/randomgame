import React from 'react';
import io from 'socket.io-client';
import { messagePlayers } from './messageTypes';

import '@babylonjs/core/Physics/physicsEngineComponent'; // side-effect adds scene.enablePhysics function
import babylonjs, { Vector3, UniversalCamera } from '@babylonjs/core';
import { Scene, Engine, SceneEventArgs } from 'react-babylonjs';
import { Player } from './gameObjects/Player';
import { CONTROLS_WASD } from './keyBindings';
import { Chunk, serializedChunk } from './gameObjects/Chunk';
import { loadTextures } from './utils/textures';

const Z_DISTANCE = 1000;
const RENDER_DISTANCE = 3;

interface IAppProps {}

interface IAppState {
    updatePrompter: number;
}

class App extends React.Component<IAppProps, IAppState> {
    socket: SocketIOClient.Socket;

    players: { [key: string]: Player } = {};
    me: Player | null = null;

    chunks: { [key: string]: Chunk } = {};

    state: IAppState = {
        updatePrompter: 0,
    };

    scene: babylonjs.Scene | null;

    constructor(props: IAppProps) {
        super(props);

        loadTextures();

        //this.socket = io('http://localhost:80/');
        this.socket = io('https://randombot-server.herokuapp.com/');

        setInterval(() => {
            this.sendUpdate();
        }, 100);

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
        this.socket.on('id', (data: string) => {
            this.me = new Player(this.scene!, data);
            this.me.bindKeys(CONTROLS_WASD);
            this.players = { [data]: this.me };

            console.log('Joined game with player ID: ', data);
        });

        this.socket.on('players', (data: messagePlayers) => {
            let players = this.players;

            Object.keys(data).forEach((key) => {
                if (key === this.me?.id) {
                    return;
                }

                if (Object.keys(this.players).includes(key)) {
                    players[key].deserialize(data[key], true);
                } else {
                    players[key] = new Player(this.scene!, key);
                    players[key].deserialize(data[key]);
                }
            });

            Object.keys(this.players).forEach((key) => {
                if (!Object.keys(data).includes(key)) {
                    players[key].setVisibility(false);
                    delete players[key];
                }
            });

            this.players = players;
        });

        this.socket.on('mapChunk', (data: serializedChunk) => {
            const id = Chunk.getId(data.x, data.y);

            if (!Object.keys(this.chunks).includes(id)) {
                this.chunks[id] = new Chunk(this.scene!, data.x, data.y);
            }

            this.chunks[id].deserialize(data);

            // TODO: throw away unused chunks
        });

        this.resize();
    }

    sendUpdate() {
        if (this.me) {
            this.socket.emit('update', { id: this.me.id, content: this.me.serialize() });
        }
    }

    tick(deltaTime: number) {
        Object.values(this.players).forEach((player) => {
            player.tick(deltaTime);
        });

        if (this.me) {
            for (let x = -RENDER_DISTANCE; x <= RENDER_DISTANCE; x++) {
                for (let y = -RENDER_DISTANCE; y <= RENDER_DISTANCE; y++) {
                    const chunkX = Math.round(this.me.x / 1600) + x;
                    const chunkY = Math.round(this.me.y / 1600) + y;
                    const chunkId = Chunk.getId(chunkX, chunkY);

                    if (!Object.keys(this.chunks).includes(chunkId)) {
                        this.socket.emit('mapRequest', { x: chunkX, y: chunkY });
                        this.chunks[chunkId] = new Chunk(this.scene!, chunkX, chunkY);
                    }
                }
            }
        }

        this.setState({ updatePrompter: this.state.updatePrompter + 1 });
    }

    resize() {
        const canvas = document.getElementById('game') as HTMLCanvasElement;

        if (canvas) {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
    }

    onSceneMount(event: SceneEventArgs) {
        const { scene, canvas } = event;

        this.scene = scene;

        const camera = new UniversalCamera('Camera', new Vector3(0, 0, Z_DISTANCE), scene);
        camera.rotation = new Vector3(0, -Math.PI, Math.PI);
        //camera.attachControl(canvas, true);

        scene.getEngine().runRenderLoop(() => {
            this.tick(scene.getEngine().getDeltaTime());

            if (this.me) {
                camera.position = new Vector3(this.me.x, this.me.y, Z_DISTANCE);
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
                        <hemisphericLight name="hemi" direction={new Vector3(0, -Math.PI, 0)} intensity={0.8} />
                    </Scene>
                </Engine>
                <div
                    style={{
                        position: 'absolute',
                        top: 20,
                        left: 25,
                        color: 'white',
                        fontFamily: 'sans-serif',
                        fontSize: '20px',
                    }}
                >
                    {this.me && Math.round(this.me.x / 100) + ' × ' + Math.round(this.me.y / 100)}
                </div>
            </>
        );
    }
}

export default App;

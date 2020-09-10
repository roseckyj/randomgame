import React from 'react';
import io from 'socket.io-client';
import { player } from './messageTypes';

import '@babylonjs/core/Physics/physicsEngineComponent'; // side-effect adds scene.enablePhysics function
import { Vector3, Mesh, Texture, FreeCamera, UniversalCamera } from '@babylonjs/core';
import { Scene, Engine, SceneEventArgs } from 'react-babylonjs';

const SPEED_CHANGE = 1;
const SLOWING = 0.95;
const KEY_UP = 38;
const KEY_DOWN = 40;
const KEY_LEFT = 37;
const KEY_RIGHT = 39;

interface IAppProps {}

interface IAppState {
    players: { [key: string]: player };
    me: player | null;
}

class App extends React.Component<IAppProps, IAppState> {
    socket: SocketIOClient.Socket;
    index: string;

    keysPressed: number[] = [];

    state: IAppState = {
        players: {},
        me: null,
    };

    constructor(props: IAppProps) {
        super(props);
        this.socket = io('https://randombot-server.herokuapp.com/');

        setInterval(() => {
            this.update();
        }, 100);

        document.addEventListener('keydown', (event) => {
            //event.preventDefault();

            if (!this.keysPressed.includes(event.keyCode)) {
                this.keysPressed.push(event.keyCode);
            }
        });

        document.addEventListener('keyup', (event) => {
            //event.preventDefault();

            if (this.keysPressed.includes(event.keyCode)) {
                this.keysPressed = this.keysPressed.filter((keyCode) => keyCode !== event.keyCode);
            }
        });

        window.addEventListener('resize', (event) => {
            this.resize();
        });
    }

    componentDidMount() {
        this.socket.on('id', (data: string) => {
            this.index = data;
            console.log('Received game ID: ', this.index);
        });
        this.socket.on('players', (data: { [key: string]: player }) => {
            this.setState({ players: data });
            if (!this.state.me) {
                this.setState({ me: data[this.index] });
                console.log('Created my character');
            }
        });
        this.resize();
    }

    update() {
        if (this.state.me) {
            this.socket.emit('update', { id: this.index, content: this.state.me });
        }
    }

    tick(deltaTimeRaw: number) {
        const deltaTime = deltaTimeRaw * 0.1;

        if (this.state.me) {
            let me = this.state.me;

            let movingX = false;
            let movingY = false;

            const diagonalModifier = Math.sqrt(2);

            if (this.keysPressed.includes(KEY_LEFT) || this.keysPressed.includes(KEY_RIGHT)) {
                movingX = true;
            }
            if (this.keysPressed.includes(KEY_UP) || this.keysPressed.includes(KEY_DOWN)) {
                movingY = true;
            }

            if (this.keysPressed.includes(KEY_LEFT)) {
                // Left
                me.velocityX -= (SPEED_CHANGE * deltaTime) / (movingY ? diagonalModifier : 1);
            }
            if (this.keysPressed.includes(KEY_RIGHT)) {
                // Right
                me.velocityX += (SPEED_CHANGE * deltaTime) / (movingY ? diagonalModifier : 1);
            }
            if (this.keysPressed.includes(KEY_UP)) {
                // Up
                me.velocityY -= (SPEED_CHANGE * deltaTime) / (movingX ? diagonalModifier : 1);
            }
            if (this.keysPressed.includes(KEY_DOWN)) {
                // Down
                me.velocityY += (SPEED_CHANGE * deltaTime) / (movingX ? diagonalModifier : 1);
            }

            me.x += this.state.me.velocityX * deltaTime;
            me.y += this.state.me.velocityY * deltaTime;

            me.velocityX *= Math.pow(SLOWING, deltaTime);
            me.velocityY *= Math.pow(SLOWING, deltaTime);

            if (Math.abs(me.velocityX) < 0.1) {
                me.velocityX = 0;
            }
            if (Math.abs(me.velocityY) < 0.1) {
                me.velocityY = 0;
            }

            this.setState({ me });
        }
    }

    resize() {
        const canvas = document.getElementById('game') as HTMLCanvasElement;

        console.log('Resizing', canvas);

        if (canvas) {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
    }

    onSceneMount(event: SceneEventArgs) {
        const { scene } = event;

        const camera = new UniversalCamera('Camera', new Vector3(0, 0, 20), scene);
        camera.rotation = new Vector3(0, -Math.PI, Math.PI);

        scene.getEngine().runRenderLoop(() => {
            this.tick(scene.getEngine().getDeltaTime());

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
                        {Object.keys(this.state.players)
                            .filter((key) => key !== this.index)
                            .map((key, index) => (
                                <plane
                                    name="canvas"
                                    size={1}
                                    position={
                                        new Vector3(
                                            this.state.players[key].x * 0.01,
                                            this.state.players[key].y * 0.01,
                                            0,
                                        )
                                    }
                                    sideOrientation={Mesh.BACKSIDE}
                                    key={index}
                                >
                                    <advancedDynamicTexture
                                        name="dialogTexture"
                                        height={100}
                                        width={100}
                                        createForParentMesh={true}
                                        hasAlpha={true}
                                        generateMipMaps={true}
                                        samplingMode={Texture.TRILINEAR_SAMPLINGMODE}
                                    >
                                        <rectangle background={'#AAFF00'} name="rect-1" height={1} width={1} />
                                    </advancedDynamicTexture>
                                </plane>
                            ))}
                        {this.state.me && (
                            <plane
                                name="canvas"
                                size={1}
                                position={new Vector3(this.state.me.x * 0.01, this.state.me.y * 0.01, 0)}
                                sideOrientation={Mesh.BACKSIDE}
                            >
                                <advancedDynamicTexture
                                    name="dialogTexture"
                                    height={100}
                                    width={100}
                                    createForParentMesh={true}
                                    hasAlpha={true}
                                    generateMipMaps={true}
                                    samplingMode={Texture.TRILINEAR_SAMPLINGMODE}
                                >
                                    <rectangle background={'#FF0000'} name="rect-1" height={1} width={1} />
                                </advancedDynamicTexture>
                            </plane>
                        )}
                    </Scene>
                </Engine>
            </>
        );
    }
}

export default App;

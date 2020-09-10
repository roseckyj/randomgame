import React from 'react';
import io from 'socket.io-client';
import { messagePlayers } from './messageTypes';

import '@babylonjs/core/Physics/physicsEngineComponent'; // side-effect adds scene.enablePhysics function
import { Vector3, UniversalCamera } from '@babylonjs/core';
import { Scene, Engine, SceneEventArgs } from 'react-babylonjs';
import { Player } from './gameObjects/Player';

const KEY_UP = 38;
const KEY_DOWN = 40;
const KEY_LEFT = 37;
const KEY_RIGHT = 39;

interface IAppProps {}

interface IAppState {
    players: { [key: string]: Player };
    me: Player | null;
    updatePrompter: number;
}

class App extends React.Component<IAppProps, IAppState> {
    socket: SocketIOClient.Socket;

    state: IAppState = {
        players: {},
        me: null,
        updatePrompter: 0,
    };

    constructor(props: IAppProps) {
        super(props);
        //this.socket = io('http://localhost:80/');
        this.socket = io('https://randombot-server.herokuapp.com/');

        setInterval(() => {
            this.update();
        }, 100);

        document.addEventListener('keydown', (event) => {
            if (this.state.me) {
                this.state.me.keyDown(event.keyCode);
            }
        });

        document.addEventListener('keyup', (event) => {
            if (this.state.me) {
                this.state.me.keyUp(event.keyCode);
            }
        });

        window.addEventListener('resize', (event) => {
            this.resize();
        });
    }

    componentDidMount() {
        this.socket.on('id', (data: string) => {
            const me = new Player(data);
            me.bindKeys({
                left: KEY_LEFT,
                right: KEY_RIGHT,
                up: KEY_UP,
                down: KEY_DOWN,
            });

            this.setState({ me, players: { [data]: me } });

            console.log('Joined game with player ID: ', data);
        });

        this.socket.on('players', (data: messagePlayers) => {
            let players = this.state.players;

            Object.keys(data).forEach((key) => {
                if (key === this.state.me?.id) {
                    return;
                }

                if (Object.keys(this.state.players).includes(key)) {
                    players[key].deserialize(data[key], true);
                } else {
                    players[key] = new Player(key);
                    players[key].deserialize(data[key]);
                }
            });

            Object.keys(this.state.players).forEach((key) => {
                if (!Object.keys(data).includes(key)) {
                    delete players[key];
                }
            });

            this.setState({ players });
        });

        this.resize();
    }

    update() {
        if (this.state.me) {
            this.socket.emit('update', { id: this.state.me.id, content: this.state.me.serialize() });
        }
    }

    tick(deltaTime: number) {
        Object.values(this.state.players).forEach((player) => {
            player.tick(deltaTime);
        });

        this.setState({ updatePrompter: Math.random() });
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

        const camera = new UniversalCamera('Camera', new Vector3(0, 0, 40), scene);
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
                        {Object.values(this.state.players).map((player, index) => player.render(index))}
                    </Scene>
                </Engine>
            </>
        );
    }
}

export default App;

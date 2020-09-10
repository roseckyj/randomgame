import React from 'react';
import io from 'socket.io-client';
import { player } from './messageTypes';

interface IAppProps {}

interface IAppState {}

class App extends React.Component<IAppProps, IAppState> {
    gameCanvas = React.createRef<HTMLCanvasElement>();
    context: CanvasRenderingContext2D | null = null;
    socket: SocketIOClient.Socket;

    players: { [key: string]: player } = {};
    me: player | null = null;
    index: string;

    keysPressed: number[] = [];

    constructor(props: IAppProps) {
        super(props);
        this.socket = io('https://randombot-server.herokuapp.com/');

        setInterval(() => {
            this.update();
        }, 100);

        setInterval(() => {
            this.tick();
        }, 10);

        document.addEventListener('keydown', (event) => {
            event.preventDefault();

            if (!this.keysPressed.includes(event.keyCode)) {
                this.keysPressed.push(event.keyCode);
            }

            console.log(this.keysPressed);
        });

        document.addEventListener('keyup', (event) => {
            event.preventDefault();

            if (this.keysPressed.includes(event.keyCode)) {
                this.keysPressed = this.keysPressed.filter((keyCode) => keyCode !== event.keyCode);
            }
        });
    }

    componentDidMount() {
        if (this.gameCanvas.current) {
            this.context = this.gameCanvas.current.getContext('2d');
        }
        this.socket.on('id', (data: string) => {
            this.index = data;
            console.log('Received game ID: ', this.index);
        });
        this.socket.on('players', (data: { [key: string]: player }) => {
            this.players = data;
            if (this.me === null) {
                this.me = this.players[this.index];
                console.log('Created my character');
            }

            if (this.context && this.gameCanvas.current) {
                this.context.clearRect(0, 0, this.gameCanvas.current.width, this.gameCanvas.current.height);
                Object.keys(this.players).forEach((key) => {
                    const player = this.players[key];

                    this.context!.fillStyle = '#FF0000';
                    this.context!.fillRect(player.x, player.y, 20, 20);
                });
            }
        });
    }

    update() {
        if (this.me) {
            this.socket.emit('update', { id: this.index, content: this.me });
        } else {
            console.log("Can't update, player does not exist!", this.index);
        }
    }

    tick() {
        if (this.me) {
            if (this.keysPressed.includes(37)) {
                // Left
                this.me.x--;
            }
            if (this.keysPressed.includes(39)) {
                // Right
                this.me.x++;
            }
            if (this.keysPressed.includes(38)) {
                // Up
                this.me.y--;
            }
            if (this.keysPressed.includes(40)) {
                // Down
                this.me.y++;
            }
        }
    }

    render() {
        return (
            <>
                <canvas
                    id="game"
                    width="640"
                    height="480"
                    style={{ border: '1px solid black' }}
                    ref={this.gameCanvas}
                />
            </>
        );
    }
}

export default App;

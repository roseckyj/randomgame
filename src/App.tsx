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

    constructor(props: IAppProps) {
        super(props);
        this.socket = io('https://randombot-server.herokuapp.com');

        setInterval(() => {
            this.update();
        }, 100);
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

    move(direction: 'up' | 'down' | 'left' | 'right') {
        if (this.me) {
            switch (direction) {
                case 'up':
                    this.me.y -= 10;
                    break;
                case 'down':
                    this.me.y += 10;
                    break;
                case 'left':
                    this.me.x -= 10;
                    break;
                case 'right':
                    this.me.x += 10;
                    break;
            }
        }
    }

    update() {
        console.log("Can't update, player does not exist!", this.index);
        if (this.me) {
            this.socket.emit('update', { id: this.index, content: this.me });
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
                ></canvas>
                <p>
                    <button onClick={() => this.move('right')}>Right</button>
                    <button onClick={() => this.move('left')}>Left</button>
                    <button onClick={() => this.move('up')}>Up</button>
                    <button onClick={() => this.move('down')}>Down</button>
                </p>
            </>
        );
    }
}

export default App;

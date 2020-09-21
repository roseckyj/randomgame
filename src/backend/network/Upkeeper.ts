import io from 'socket.io-client';

export class Upkeeper {
    constructor(upkeepURL: string, interval: number) {
        const socket = io(upkeepURL);

        setInterval(() => {
            socket.emit('client_ping', 999);
        }, interval);
    }
}

import { GameScene } from '../../src/GameMechanics/gameObjects/Scene';
import { ConnectedClient } from './ConnectedClient';
import { AbstractMapGenerator } from '../mapGenerator/AbstractMapGenerator';
const express = require('express')();
const http = require('http').Server(express);

export class NetworkServer {
    socketServer: SocketIO.Server = require('socket.io')(http);
    connectedClients: ConnectedClient[] = [];

    constructor(private port: number | string, private scene: GameScene, private mapGenerator: AbstractMapGenerator) {
        this.socketServer.on('connection', (socket: SocketIO.Socket) => {
            this.connectedClients.push(new ConnectedClient(socket, scene, mapGenerator));
        });
    }

    public close() {
        this.socketServer.close();
    }

    public open() {
        http.listen(this.port, () => {
            console.info('██████████████████████████████████████████');
            console.info(`API is running at http://localhost:${this.port}`);
            console.info('██████████████████████████████████████████');
        });
    }

    public sendUpdates() {
        // this.socket.emit('update', { id: player.id, content: player.serialize() });
    }
}

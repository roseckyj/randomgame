import { GameScene } from '../../src/GameMechanics/gameObjects/Scene';
import { ConnectedClient } from './ConnectedClient';
import { AbstractMapGenerator } from '../mapGenerator/AbstractMapGenerator';
import { serializedEntity } from '../../src/GameMechanics/gameObjects/01_AbstractGameEntity';
import { messageEntities } from '../../src/gameMechanics/network/messageTypes';
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
            console.info('==========================================');
            console.info(`API is running at http://localhost:${this.port}`);
            console.info();
        });
    }

    public sendUpdates() {
        const updated: serializedEntity<any>[] = this.scene.entities
            .filter((player) => player.dirty)
            .map((value) => value.serialize());
        const removed: serializedEntity<any>[] = this.scene.entities
            .filter((player) => player.server_dead)
            .map((value) => value.serialize());

        const message: messageEntities = {
            updated,
            removed,
        };

        this.socketServer.emit('entities', message);

        this.scene.entities
            .filter((player) => player.server_dead)
            .forEach((value, key) => this.scene.entities.remove(key));
    }
}

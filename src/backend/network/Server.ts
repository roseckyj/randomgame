import { ConnectedClient } from './ConnectedClient';
import { AbstractMapGenerator } from '../mapGenerator/AbstractMapGenerator';
import { GameScene } from '../../shared/gameObjects/Scene';
import { serializedEntity } from '../../shared/gameObjects/01_AbstractGameEntity';
import { messageEntities } from '../../shared/network/messageTypes';
const express = require('express')();
const http = require('http').Server(express);

export class NetworkServer {
    socketServer: SocketIO.Server = require('socket.io')(http);
    connectedClients: ConnectedClient[] = [];

    constructor(private port: number | string, private scene: GameScene, mapGenerator: AbstractMapGenerator) {
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
        const dirty = this.scene.entities.filter((entity) => entity.dirty);
        const dead = this.scene.entities.filter((entity) => entity.server_dead);

        const message: messageEntities = {
            updated: dirty.map((value) => value.serialize()),
            removed: dead.map((value) => value.serialize()),
        };

        this.socketServer.emit('entities', message);

        dead.forEach((value, key) => this.scene.entities.remove(key));
        dirty.forEach((value) => value.clean());

        //console.log("dirty: ", dirty.getKeys().length, "  dead: ", dead.getKeys().length)
    }
}

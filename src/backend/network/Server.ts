import { ConnectedClient } from './ConnectedClient';
import { AbstractMapGenerator } from '../mapGenerator/AbstractMapGenerator';
import { GameScene } from '../../shared/Scene';
import express from "express";
import { ServerGUI } from './ServerGUI';

export class NetworkServer {
    expressApp = express();
    httpServer = require('http').Server(this.expressApp);
    socketServer: SocketIO.Server = require('socket.io')(this.httpServer);
    serverGUI: ServerGUI;

    connectedClients: ConnectedClient[] = [];
    dirtyEntities: string[] = [];

    constructor(private port: number | string, private scene: GameScene, mapGenerator: AbstractMapGenerator) {
        this.socketServer.on('connection', (socket: SocketIO.Socket) => {
            this.connectedClients.push(new ConnectedClient(socket, scene, mapGenerator, (keys) => this.setDirty(keys)));
        });

        this.serverGUI = new ServerGUI(this.expressApp, scene);
    }

    public close() {
        this.socketServer.close();
    }

    public open() {
        this.httpServer.listen(this.port, () => {
            console.info('==========================================');
            console.info(`API is running at http://localhost:${this.port}`);
            console.info();
        });
    }

    public async sendUpdates() {
        this.connectedClients.forEach((client) => client.sendUpdates(this.dirtyEntities));

        /*
        const dirty = this.scene.entities.filter((entity) => entity.dirty);
        const dead = this.scene.entities.filter((entity) => entity.disabled);

        const message: messageEntities = {
            updated: dirty.map((value) => value.serialize()),
            removed: dead.map((value) => value.serialize()),
        };

        this.socketServer.emit('entities', message);

        dead.forEach((value, key) => this.scene.entities.remove(key));
        dirty.forEach((value) => value.clean());

        //console.log("dirty: ", dirty.getKeys().length, "  dead: ", dead.getKeys().length)
        */

        this.dirtyEntities = this.dirtyEntities.filter(
            (e) => this.scene.entities.get(e)?.serialize().type === 'player',
        );
    }

    private setDirty(keys: string[]): void {
        if (!this.dirtyEntities) this.dirtyEntities = [];
        keys.forEach((key) => !this.dirtyEntities.includes(key) && this.dirtyEntities.push(key));
    }
}

import { ConnectedClient } from './ConnectedClient';
import { AbstractMapGenerator } from '../mapGenerator/AbstractMapGenerator';
import { GameScene } from '../../shared/Scene';
import express from 'express';
import { ServerGUI } from './ServerGUI';
import { Chunk } from '../../shared/gameObjects/10_Chunk';
import { AbstractGameEntity } from '../../shared/gameObjects/20_AbstractGameEntity';
import { messageToken } from '../../shared/network/messageTypes';

export class NetworkServer {
    expressApp = express();
    httpServer = require('http').Server(this.expressApp);
    socketServer: SocketIO.Server = require('socket.io')(this.httpServer);
    serverGUI: ServerGUI;

    connectedClients: ConnectedClient[] = [];
    dirtyEntities: Set<AbstractGameEntity> = new Set();

    constructor(private port: number | string, public scene: GameScene, mapGenerator: AbstractMapGenerator) {
        this.socketServer.on('connection', (socket: SocketIO.Socket) => {
            socket.on('login', (data: any) => {
                const client = new ConnectedClient(socket, scene, mapGenerator, (e) => this.setDirty(e));
                client.login(data);
                this.connectedClients.push(client);
            });
            socket.on('token', (data: messageToken) => {
                const possible = this.connectedClients.filter((client) => client.token === data.token);
                if (possible.length > 0) {
                    if (data.type === 'data') {
                        possible[0].largeDataSocket = socket;
                        possible[0].setMainListeners(socket);
                        socket.emit('ok', '');
                    }
                } else {
                    socket.disconnect();
                }
            });
        });

        this.serverGUI = new ServerGUI(this.expressApp, this);
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

        const old = new Set(this.dirtyEntities);
        old.forEach(
            (e) => e.serialize().type !== 'player' && this.dirtyEntities.delete(e)
        );
    }

    public setDirty(entities: AbstractGameEntity[]): void {
        if (!this.dirtyEntities) this.dirtyEntities = new Set();
        entities.forEach((e) => this.dirtyEntities.add(e));
    }

    public getActiveChunks() {
        let set = new Set<Chunk>();
        this.connectedClients.forEach((client) => client.activeChunks.forEach((chunk) => set.add(chunk)));
        return set;
    }
}

import io from 'socket.io-client';
import { Player, serializedPlayer } from '../../../shared/gameObjects/60_Player';
import { GameScene } from '../../../shared/Scene';
import babylonjs from 'babylonjs';
import { serializedChunk, Chunk } from '../../../shared/gameObjects/10_Chunk';
import {
    messageAuth,
    messageEntities,
    messageError,
    messageLogin,
    messageUpdate,
} from '../../../shared/network/messageTypes';
import { AbstractGameEntity, Platform, serializedEntity } from '../../../shared/gameObjects/20_AbstractGameEntity';
import { Tree } from '../../../shared/gameObjects/60_Tree';
import { Stone } from '../../../shared/gameObjects/60_Stone';
import md5 from 'md5';
import { Chicken } from '../../../shared/gameObjects/60_Chicken';

type callback = (data: any) => void;

export class NetworkClient {
    private updateSocket: SocketIOClient.Socket;
    private largeDataSocket: SocketIOClient.Socket | null;

    private userId: string;
    private callbacks: { [key: string]: callback } = {
        authenticated: () => {},
        updated: () => {},
        invalidPassword: () => {},
        disconnect: () => {},
    };
    private token: string;

    private player: serializedEntity<serializedPlayer>;

    constructor(private apiUrl: string, private scene: GameScene, private getBabylonScene: () => babylonjs.Scene) {}

    public on(event: 'authenticated' | 'updated' | 'invalidPassword' | 'disconnect', callback: callback) {
        this.callbacks[event] = callback;
    }

    public close() {
        this.updateSocket.disconnect();
        this.updateSocket && this.updateSocket.disconnect();
        this.largeDataSocket && this.largeDataSocket.disconnect();
    }

    public open() {
        this.updateSocket = io(this.apiUrl);
        this.setServiceListeners(this.updateSocket);
    }

    private enableGameListeners() {
        this.largeDataSocket = io(this.apiUrl);
        this.largeDataSocket.on('ok', (_data: '') => {
            console.log('Secondary socket connected!');
            this.setMainListeners(this.updateSocket);
            this.setMainListeners(this.largeDataSocket!);

            this.callbacks['authenticated'](this.player);
        });
        this.largeDataSocket.emit('token', { token: this.token, type: 'data' });
    }

    private setMainListeners(socket: SocketIOClient.Socket) {
        socket.on('entities', async (data: messageEntities) => {
            data.removed.forEach((entity) => entity !== this.userId && this.scene.entities.remove(entity));
            data.updated.forEach(
                (entity) =>
                    entity.id !== this.userId &&
                    this.scene.entities.updateOrCreate(
                        entity.id,
                        entity,
                        () => this.createEntity(entity)!,
                        data.timestamp,
                    ),
            );

            this.scene.timeStart = data.time;
            this.callbacks.updated({});
        });

        socket.on('mapChunk', async (data: serializedChunk) => {
            const id = Chunk.getId(data.x, data.y);

            this.scene.chunks.updateOrCreate(
                id,
                data,
                () => {
                    const chunk = new Chunk(this.scene, data.x, data.y);
                    chunk.attachRenderer(this.getBabylonScene());
                    return chunk;
                },
                0,
            );
        });
    }

    private setServiceListeners(socket: SocketIOClient.Socket) {
        socket.on('auth', (data: messageAuth) => {
            this.userId = data.player.id;
            this.token = data.token;
            console.log(
                'Joined game with player ' +
                    data.player.data.name +
                    ' (' +
                    data.player.id +
                    '), waiting for second socket...',
            );
            this.enableGameListeners();
            this.player = data.player;
        });

        socket.on('err', async (data: messageError) => {
            switch (data.error) {
                case 'credentials':
                    this.callbacks.invalidPassword(data);
            }
        });
    }

    public sendPlayerUpdate(player: Player) {
        const payload: messageUpdate = {
            player: player.serialize(),
            loadedChunks: this.scene.chunks.filter((ch) => ch.getVisibility()).map((ch) => ch.id),
            timestamp: new Date().getTime(),
        };
        this.updateSocket && this.updateSocket.emit('update', payload);
    }

    public requestChunk(x: number, y: number) {
        this.updateSocket && this.updateSocket.emit('mapRequest', { x, y });
    }

    public auth(name: string, password: string) {
        const payload: messageLogin = {
            name,
            passwordHash: md5(password),
        };
        this.updateSocket.emit('login', payload);
    }

    private createEntity(entity: serializedEntity<any>): AbstractGameEntity | undefined {
        let e = null;
        switch (entity.type) {
            case 'player': {
                e = new Player(this.scene, entity.id);
                break;
            }
            case 'tree': {
                e = new Tree(this.scene, entity.id);
                break;
            }
            case 'stone': {
                e = new Stone(this.scene, entity.id);
                break;
            }
            case 'chicken': {
                e = new Chicken(this.scene, entity.id);
                break;
            }
        }
        if (e) {
            e.deserializeImmediatelly(entity, 0);
            e.attachControllers(Platform.Client);
            e.attachDirtyListener((entity) => this.scene.updateEntity(entity));
            return e;
        }
        console.error('Entity "' + entity.type + ' does not exist!');
    }
}

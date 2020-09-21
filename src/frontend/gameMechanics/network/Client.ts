import io from 'socket.io-client';
import { Player, serializedPlayer } from '../../../shared/gameObjects/Player';
import { GameScene } from '../../../shared/gameObjects/Scene';
import babylonjs from 'babylonjs';
import { serializedChunk, Chunk } from '../../../shared/gameObjects/Chunk';
import { messageEntities, messageError, messageLogin } from '../../../shared/network/messageTypes';
import { AbstractGameEntity, serializedEntity } from '../../../shared/gameObjects/01_AbstractGameEntity';
import { Tree } from '../../../shared/gameObjects/Tree';
import { Stone } from '../../../shared/gameObjects/Stone';
import md5 from 'md5';

type callback = (data: any) => void;

export class NetworkClient {
    private socket: SocketIOClient.Socket;
    private userId: string;
    private opened: boolean;
    private callbacks: { [key: string]: callback } = {
        authenticated: () => {},
        updated: () => {},
        invalidPassword: () => {},
        disconnect: () => {},
    };

    constructor(private apiUrl: string, private scene: GameScene, private getBabylonScene: () => babylonjs.Scene) {}

    public on(event: 'authenticated' | 'updated' | 'invalidPassword' | 'disconnect', callback: callback) {
        this.callbacks[event] = callback;
    }

    public close() {
        this.socket.disconnect();
    }

    public open() {
        this.opened = true;
        this.socket = io(this.apiUrl);
        this.setListeners();

        this.socket.on('auth', (data: serializedEntity<serializedPlayer>) => {
            this.userId = data.id;
            this.callbacks['authenticated'](data);
            console.log('Joined game with player ', data.data.name, ' (' + data.id + ')');
        });
    }

    public sendPlayerUpdate(player: Player) {
        const payload: serializedEntity<serializedPlayer> = player.serialize();
        this.socket.emit('update', payload);
    }

    public requestChunk(x: number, y: number) {
        this.socket.emit('mapRequest', { x, y });
    }

    public auth(name: string, password: string) {
        const payload: messageLogin = {
            name,
            passwordHash: md5(password),
        };
        this.socket.emit('login', payload);
    }

    private setListeners() {
        this.socket.on('entities', async (data: messageEntities) => {
            data.removed.forEach((entity) => entity.id !== this.userId && this.scene.entities.remove(entity.id));
            data.updated.forEach(
                (entity) =>
                    entity.id !== this.userId &&
                    this.scene.entities.updateOrCreate(entity.id, entity, false, () => this.createEntity(entity)!),
            );
            this.callbacks.updated({});
        });

        this.socket.on('mapChunk', async (data: serializedChunk) => {
            const id = Chunk.getId(data.x, data.y);

            this.scene.chunks.updateOrCreate(id, data, false, () =>
                new Chunk(this.scene, data.x, data.y).attachBabylon(this.getBabylonScene()),
            );

            this.scene.chunks
                .filter((value) => Math.abs(value.position.x - data.x) <= 1 && Math.abs(value.position.y - data.y) <= 1)
                .forEach((value) => value.updateMesh());
        });

        this.socket.on('err', async (data: messageError) => {
            switch (data.error) {
                case 'credentials':
                    this.callbacks.invalidPassword(data);
            }
        });
    }

    private createEntity(entity: serializedEntity<any>): AbstractGameEntity | undefined {
        switch (entity.type) {
            case 'player': {
                const e = new Player(this.scene, entity.id);
                e.attachBabylon(this.getBabylonScene());
                e.deserialize(entity, false, true);
                return e;
            }
            case 'tree': {
                const e = new Tree(this.scene, entity.id);
                e.attachBabylon(this.getBabylonScene());
                e.deserialize(entity, false);
                return e;
            }
            case 'stone': {
                const e = new Stone(this.scene, entity.id);
                e.attachBabylon(this.getBabylonScene());
                e.deserialize(entity, false);
                return e;
            }
        }
        console.error('Entity "' + entity.type + ' does not exist!');
    }
}

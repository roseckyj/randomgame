import { AbstractMapGenerator } from '../mapGenerator/AbstractMapGenerator';
import { uuid } from 'uuidv4';
import { Player, serializedPlayer } from '../../shared/gameObjects/60_Player';
import { GameScene } from '../../shared/Scene';
import { AbstractGameEntity, Platform, serializedEntity } from '../../shared/gameObjects/20_AbstractGameEntity';
import {
    messageAuth,
    messageEntities,
    messageError,
    messageLogin,
    messageMapRequest,
    messageUpdate,
} from '../../shared/network/messageTypes';
import { IndexedList } from '../../shared/utils/IndexedList';
import { Chunk } from '../../shared/gameObjects/10_Chunk';

const DISCONNECT_TIMEOUT = 3000;

let users: { [key: string]: { passwordHash: string; player: Player } } = {};

export class ConnectedClient {
    alive: boolean;
    aliveTimeout: NodeJS.Timeout;

    player: Player | null = null;
    activeEntities: Set<AbstractGameEntity> = new Set();
    activeChunks: Set<Chunk> = new Set();

    token: string = uuid();

    largeDataSocket: SocketIO.Socket | null;

    constructor(
        private updateSocket: SocketIO.Socket,
        private scene: GameScene,
        private mapGenerator: AbstractMapGenerator,
        private setDirty: (entities: AbstractGameEntity[]) => void,
    ) {
        this.updateSocket.on('client_ping', (data: any) => {
            this.updateSocket.emit('client_pong', data);
        });
    }

    public login(data: messageLogin) {
        if (data.name.length < 3) {
            const payload: messageError = {
                error: 'shortName',
                description: 'Name is too short',
            };
            this.updateSocket.emit('err', payload);
        }

        const account = users[data.name];

        if (account) {
            if (account.passwordHash === data.passwordHash) {
                this.player = account.player;
                console.log('Logged in user ' + data.name);
                this.authenticated();
            } else {
                const payload: messageError = {
                    error: 'credentials',
                    description: 'Invalid password',
                };
                this.updateSocket.emit('err', payload);
            }
        } else {
            console.log('Registered new user ' + data.name);
            this.player = new Player(this.scene, uuid());
            this.player.name = data.name;
            this.player.attachControllers(Platform.Server);
            this.scene.entities.add(this.player.id, this.player);
            this.player.attachDirtyListener((entity) => this.scene.updateEntity(entity));

            users[data.name] = {
                passwordHash: data.passwordHash,
                player: this.player,
            };
            this.authenticated();
        }
    }

    public async sendUpdates(dirtyEntities: Set<AbstractGameEntity>) {
        if (!this.player || !this.updateSocket) return;

        const set = new Set<AbstractGameEntity>();
        this.activeChunks.forEach((chunk) => chunk.entities.forEach((e) => set.add(e)));

        const dirtyInRange = Array.from(set).filter((e) => dirtyEntities.has(e));

        set.forEach((e) => this.activeEntities.delete(e));

        const updated = dirtyInRange.filter((value) => !value.disabled);
        const removed = Array.from(this.activeEntities).map((chunk) => chunk.id);

        const message: messageEntities = {
            updated: updated.map((value) => value.serialize()),
            removed: removed,
            time: this.scene.timeStart,
            timestamp: new Date().getTime(),
        };
        this.updateSocket.emit('entities', message);

        this.activeEntities = set;
    }

    private authenticated() {
        if (!this.player) {
            return;
        }
        this.player.disabled = false;

        const payload: messageAuth = {
            player: this.player.serialize(),
            token: this.token,
        };
        this.updateSocket.emit('auth', payload);

        this.alive = true;
        this.aliveTimeout = setTimeout(() => this.die(), DISCONNECT_TIMEOUT);
        this.setServiceListeners(this.updateSocket);
        this.setMainListeners(this.updateSocket);
    }

    public setServiceListeners(_socket: SocketIO.Socket) {}

    public setMainListeners(socket: SocketIO.Socket) {
        socket.on('update', async (data: messageUpdate) => {
            this.scene.entities.update(data.player.id, data.player, data.timestamp);
            this.activeChunks = new Set(data.loadedChunks.map((id) => this.scene.chunks.get(id)!));
            this.keepAlive();
        });

        socket.on('mapRequest', async (data: messageMapRequest) => {
            this.mapGenerator.generateChunk(data.x, data.y).then((chunk) => {
                if (!this.largeDataSocket) return;
                this.largeDataSocket.emit('mapChunk', chunk.serialize());

                let entities: IndexedList<AbstractGameEntity> = new IndexedList<AbstractGameEntity>();

                this.scene.entities.forEach((entity) => {
                    if (entity.disabled || entity.id === this.player!.id) return;

                    const distX = Math.abs(Math.round(data.x * 16) - entity.position.x) / 16;
                    const distY = Math.abs(Math.round(data.y * 16) - entity.position.y) / 16;

                    if (distX <= 8 && distY <= 8) {
                        entities.add(entity.id, entity);
                    }
                });

                const message: messageEntities = {
                    updated: entities.map((value) => value.serialize()),
                    removed: [],
                    time: this.scene.timeStart,
                    timestamp: new Date().getTime(),
                };
                this.largeDataSocket.emit('entities', message);
            });
            this.keepAlive();
        });
    }

    private keepAlive() {
        if (this.player) {
            this.player.disabled = false;
        }
        this.alive = true;
        clearTimeout(this.aliveTimeout);
        this.aliveTimeout = this.aliveTimeout = setTimeout(() => this.die(), DISCONNECT_TIMEOUT);
    }

    private die() {
        if (this.player) {
            this.player.disabled = true;
            this.setDirty([this.player]);
        }
        this.alive = false;
        //this.socket.disconnect();
        console.log('Disconnected for inactivity');
    }
}

import { AbstractMapGenerator } from '../mapGenerator/AbstractMapGenerator';
import { uuid } from 'uuidv4';
import { Player, serializedPlayer } from '../../shared/gameObjects/60_Player';
import { GameScene } from '../../shared/Scene';
import { AbstractGameEntity, Platform, serializedEntity } from '../../shared/gameObjects/20_AbstractGameEntity';
import { messageEntities, messageError, messageLogin, messageMapRequest } from '../../shared/network/messageTypes';
import { IndexedList } from '../../shared/utils/IndexedList';
import { ImmediateDeserializeController } from '../../shared/gameObjects/controllers/controllers/deserializers/ImmediateDeserializeController';

const DISCONNECT_TIMEOUT = 3000;
const RENDER_DISTANCE = 5;

let users: { [key: string]: { passwordHash: string; player: Player } } = {};

export class ConnectedClient {
    alive: boolean;
    aliveTimeout: NodeJS.Timeout;

    player: Player | null = null;
    activeEntities: string[] = [];

    constructor(
        private socket: SocketIO.Socket,
        private scene: GameScene,
        private mapGenerator: AbstractMapGenerator,
        private setDirty: (keys: string[]) => void,
    ) {
        this.socket.on('client_ping', (data: any) => {
            this.socket.emit('client_pong', data);
        });

        this.socket.on('login', (data: messageLogin) => {
            if (data.name.length < 3) {
                const payload: messageError = {
                    error: 'shortName',
                    description: 'Name is too short',
                };
                this.socket.emit('err', payload);
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
                    this.socket.emit('err', payload);
                }
            } else {
                console.log('Registered new user ' + data.name);
                this.player = new Player(this.scene, uuid());
                this.player.name = data.name;
                this.player.attachControllers(Platform.Server);
                this.scene.entities.add(this.player.id, this.player);

                users[data.name] = {
                    passwordHash: data.passwordHash,
                    player: this.player,
                };
                this.authenticated();
            }
        });
    }

    public async sendUpdates(dirtyEntities: string[]) {
        if (!this.player) return;
        /*

        const newInRange: string[] = [];

        this.scene.entities.forEach((entity) => {
            if (entity.disabled || entity.id === this.player!.id) return;

            const distX = Math.abs(Math.round(this.player!.position.x) - entity.position.x) / 16;
            const distY = Math.abs(Math.round(this.player!.position.y) - entity.position.y) / 16;

            if (distX < RENDER_DISTANCE && distY < RENDER_DISTANCE) {
                newInRange.push(entity.id);
            }
        });

        const newlyAdded = newInRange.filter((key) => !this.activeEntities.includes(key));
        const dirty = newInRange.filter((key) => this.scene.entities.get(key)?.dirty);

        const removed = this.activeEntities
            .filter((key) => !newInRange.includes(key))
            .map((key) => this.scene.entities.get(key)!.serialize());

        const updated = newlyAdded.concat(dirty).map((key) => this.scene.entities.get(key)!.serialize());

        if (updated.length === 0 && removed.length === 0) return;

        const message: messageEntities = {
            updated: updated,
            removed: removed,
        };

        this.socket.emit('entities', message);

        this.activeEntities = newInRange;
        */

        const dirtyInRange = dirtyEntities
            .map((key) => this.scene.entities.get(key))
            .filter((entity) => {
                if (!entity || entity.id === this.player!.id) return false;

                const distX = Math.abs(Math.round(this.player!.position.x) - entity.position.x) / 16;
                const distY = Math.abs(Math.round(this.player!.position.y) - entity.position.y) / 16;

                if (distX < RENDER_DISTANCE && distY < RENDER_DISTANCE) {
                    return true;
                }
                return false;
            }) as AbstractGameEntity[];

        const updated = dirtyInRange.filter((value) => !value.disabled);
        const removed = dirtyEntities.map((key) => this.scene.entities.get(key)!).filter((value) => value.disabled);

        const message: messageEntities = {
            updated: updated.map((value) => value.serialize()),
            removed: removed.map((value) => value.serialize()),
            time: this.scene.timeStart,
        };
        this.socket.emit('entities', message);
    }

    private authenticated() {
        if (!this.player) {
            return;
        }
        this.player.disabled = false;

        this.socket.emit('auth', this.player.serialize());

        const entities = this.scene.entities.filter((entity) => !entity.disabled);
        const message: messageEntities = {
            updated: entities.map((value) => value.serialize()),
            removed: [],
            time: this.scene.timeStart,
        };
        this.socket.emit('entities', message);

        this.setListeners();
        this.alive = true;
        this.aliveTimeout = setTimeout(() => this.die(), DISCONNECT_TIMEOUT);
    }

    private setListeners() {
        this.socket.on('update', async (data: serializedEntity<serializedPlayer>) => {
            this.scene.entities.update(data.id, data, false);
            this.keepAlive();
            this.setDirty([data.id]);
        });

        this.socket.on('mapRequest', async (data: messageMapRequest) => {
            this.mapGenerator.generateChunk(data.x, data.y).then((chunk) => {
                this.socket.emit('mapChunk', chunk.serialize());

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
                };
                this.socket.emit('entities', message);
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
            this.setDirty([this.player.id]);
        }
        this.alive = false;
        //this.socket.disconnect();
        console.log('Disconnected for inactivity');
    }
}

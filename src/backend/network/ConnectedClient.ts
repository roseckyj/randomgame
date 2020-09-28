import { AbstractMapGenerator } from '../mapGenerator/AbstractMapGenerator';
import { uuid } from 'uuidv4';
import { Player, serializedPlayer } from '../../shared/gameObjects/Player';
import { GameScene } from '../../shared/gameObjects/Scene';
import { serializedEntity } from '../../shared/gameObjects/01_AbstractGameEntity';
import { messageEntities, messageError, messageLogin, messageMapRequest } from '../../shared/network/messageTypes';

const DISCONNECT_TIMEOUT = 10000;

let users: { [key: string]: { passwordHash: string; player: Player } } = {};

export class ConnectedClient {
    alive: boolean;
    aliveTimeout: NodeJS.Timeout;

    player: Player | null = null;

    constructor(private socket: SocketIO.Socket, private scene: GameScene, private mapGenerator: AbstractMapGenerator) {
        this.setListeners();
        this.alive = true;
        this.aliveTimeout = setTimeout(() => this.die(), DISCONNECT_TIMEOUT);

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
                this.scene.entities.add(this.player.id, this.player);

                users[data.name] = {
                    passwordHash: data.passwordHash,
                    player: this.player,
                };
                this.authenticated();
            }
        });
    }

    private authenticated() {
        if (!this.player) {
            return;
        }

        this.socket.emit('auth', this.player.serialize());

        const entities = this.scene.entities.filter((entity) => !entity.server_dead);
        const message: messageEntities = {
            updated: entities.map((value) => value.serialize()),
            removed: [],
        };
        this.socket.emit('entities', message);

        this.setListeners();
    }

    private setListeners() {
        this.socket.on('update', (data: serializedEntity<serializedPlayer>) => {
            this.scene.entities.update(data.id, data, true, false);
            this.keepAlive();
        });

        this.socket.on('mapRequest', (data: messageMapRequest) => {
            this.mapGenerator.generateChunk(data.x, data.y).then((chunk) => {
                this.socket.emit('mapChunk', chunk.serialize());
            });
            this.keepAlive();
        });
    }

    private keepAlive() {
        if (this.player) {
            this.player.server_dead = false;
        }
        this.alive = true;
        clearTimeout(this.aliveTimeout);
        this.aliveTimeout = this.aliveTimeout = setTimeout(() => this.die(), DISCONNECT_TIMEOUT);
    }

    private die() {
        if (this.player) {
            this.player.server_dead = true;
        }
        this.alive = false;
    }
}

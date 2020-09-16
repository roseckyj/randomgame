import { GameScene } from "../../src/GameMechanics/gameObjects/Scene";
import { messageMapRequest, messageUpdate } from "./messageTypes";
import { AbstractMapGenerator } from "../mapGenerator/AbstractMapGenerator";
import { Player } from "../../src/GameMechanics/gameObjects/Player";
import { uuid } from 'uuidv4';

const DISCONNECT_TIMEOUT = 10000;

export class ConnectedClient {
    alive: boolean;
    aliveTimeout: NodeJS.Timeout;

    player: Player;

    constructor(private socket: SocketIO.Socket, private scene: GameScene, private mapGenerator: AbstractMapGenerator) {
        this.setListeners();
        this.alive = true;
        this.aliveTimeout = setTimeout(() => this.die(), DISCONNECT_TIMEOUT);

        this.player = new Player(this.scene, uuid());
        this.scene.players.add(this.player.id, this.player);
    }

    private setListeners() {
        this.socket.on('update', (data: messageUpdate) => {
            this.scene.players.update(data.id, data.content, false);
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
        this.alive = true;
        clearTimeout(this.aliveTimeout);
        this.aliveTimeout = this.aliveTimeout = setTimeout(() => this.die(), DISCONNECT_TIMEOUT);
    }

    private die() {
        this.alive = false;
    }
}

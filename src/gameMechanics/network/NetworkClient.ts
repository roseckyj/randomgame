import io from 'socket.io-client';
import { Player } from '../gameObjects/Player';
import { GameScene } from '../Scene';
import { messagePlayers } from '../../messageTypes';
import babylonjs from '@babylonjs/core';
import { serializedChunk, Chunk } from '../gameObjects/Chunk';

type callback = (data: any) => void;

export class NetworkClient {
    private socket: SocketIOClient.Socket;
    private userId: string;
    private opened: boolean;
    private callbacks: { [key: string]: callback } = {
        authenticated: () => {},
        updated: () => {},
    };

    constructor(private apiUrl: string, private scene: GameScene, private getBabylonScene: () => babylonjs.Scene) {}

    public on(event: 'authenticated' | 'updated', callback: callback) {
        this.callbacks[event] = callback;
    }

    public close() {
        this.socket.disconnect();
    }

    public open() {
        this.opened = true;
        this.socket = io(this.apiUrl);
        this.setListeners();

        this.socket.on('id', (data: string) => {
            this.userId = data;
            this.callbacks['authenticated']({ id: data });
            console.log('Joined game with player ID: ', data);
        });
    }

    public sendPlayerUpdate(player: Player) {
        this.socket.emit('update', { id: player.id, content: player.serialize() });
    }

    public requestChunk(x: number, y: number) {
        this.socket.emit('mapRequest', { x, y });
    }

    private setListeners() {
        this.socket.on('players', (data: messagePlayers) => {
            this.scene.players.forEach((player, key) => {
                if (!Object.keys(data).includes(key)) {
                    this.scene.players.get(key).setVisibility(false);
                } else {
                    this.scene.players.get(key).setVisibility(true);
                }
            });

            Object.keys(data).forEach((key) => {
                if (key === this.userId) {
                    return;
                }

                this.scene.players.updateOrCreate(key, data[key], () =>
                    new Player(key).attachBabylon(this.getBabylonScene()),
                );
            });
        });

        this.socket.on('mapChunk', (data: serializedChunk) => {
            const id = Chunk.getId(data.x, data.y);

            this.scene.chunks.updateOrCreate(id, data, () =>
                new Chunk(data.x, data.y).attachBabylon(this.getBabylonScene()),
            );
            // TODO: throw away unused chunks
        });
    }
}

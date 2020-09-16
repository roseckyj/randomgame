import { Player } from './gameObjects/Player';
import { Chunk } from './gameObjects/Chunk';

export class GameScene {
    players = new IndexedList<Player>();
    chunks = new IndexedList<Chunk>();

    tickAll(deltaTime: number) {
        this.players.forEach((value) => value.tick(deltaTime));
        this.chunks.forEach((value) => value.tick(deltaTime));
    }

    getTile(x: number, y: number) {
        const calcX = Math.floor(x) + 8;
        const calcY = Math.floor(y) + 8;

        const chunkX = Math.floor(calcX / 16);
        const chunkY = Math.floor(calcY / 16);
        const chunk = this.chunks.get(Chunk.getId(chunkX, chunkY));

        if (!chunk || !chunk.ground[calcX - chunkX * 16] || !chunk.ground[calcX - chunkX * 16][calcY - chunkY * 16]) {
            return -1;
        }

        return chunk.ground[calcX - chunkX * 16][calcY - chunkY * 16];
    }
}

class IndexedList<T extends Player | Chunk> {
    values: { [key: string]: T } = {};

    addMore(values: { [key: string]: T }) {
        this.values = { ...this.values, ...values };
    }

    add(key: string, value: T) {
        this.values[key] = value;
    }

    remove(key: string) {
        if (!this.includes(key)) return;
        this.values[key].detachBabylon();
        delete this.values[key];
    }

    update(key: string, serialized: any, smooth?: boolean) {
        this.values[key].deserialize(serialized, smooth);
    }

    updateOrCreate(key: string, serialized: any, newObjectCreator: () => T, smooth?: boolean) {
        if (!this.includes(key)) {
            this.values[key] = newObjectCreator();
        }
        this.values[key].deserialize(serialized, smooth);
    }

    get(key: string) {
        if (!this.includes(key)) return null;
        return this.values[key];
    }

    includes(key: string) {
        return Object.keys(this.values).includes(key);
    }

    forEach(callbackfn: (value: T, key: string, index: number) => void) {
        const keys = Object.keys(this.values);

        keys.forEach((key, index) => {
            callbackfn(this.values[key], key, index);
        });
    }

    filter(callbackfn: (value: T, key: string, index: number) => boolean) {
        const keys = Object.keys(this.values);

        const result = new IndexedList<T>();

        keys.forEach((key, index) => {
            if (callbackfn(this.values[key], key, index)) {
                result.add(key, this.values[key]);
            }
        });

        return result;
    }
}

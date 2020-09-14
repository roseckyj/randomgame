import { Player } from './gameObjects/Player';
import { Chunk } from './gameObjects/Chunk';

export class GameScene {
    players = new IndexedList<Player>();
    chunks = new IndexedList<Chunk>();

    tickAll(deltaTime: number) {
        this.players.forEach((value) => value.tick(deltaTime));
        this.chunks.forEach((value) => value.tick(deltaTime));
    }
}

class IndexedList<T extends Player | Chunk> {
    values: { [key: string]: T } = {};

    add(key: string, value: T) {
        this.values[key] = value;
    }

    remove(key: string) {
        if (!this.includes(key)) return;
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

        let result = Object.assign({}, this.values);

        keys.forEach((key, index) => {
            if (!callbackfn(this.values[key], key, index)) {
                delete result[key];
            }
        });

        return result;
    }
}
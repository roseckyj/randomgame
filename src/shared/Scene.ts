import { Chunk } from './gameObjects/10_Chunk';
import { IndexedList } from './utils/IndexedList';
import { AbstractGameEntity } from './gameObjects/20_AbstractGameEntity';

export class GameScene {
    entities = new IndexedList<AbstractGameEntity>();
    chunks = new IndexedList<Chunk>();

    tickAll(deltaTime: number) {
        this.entities.forEach((value) => value.tick(deltaTime));
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

    getColisions(entity: AbstractGameEntity) {
        return this.entities.filter((value) => entity !== value && value.colidesWith(entity));
    }
}
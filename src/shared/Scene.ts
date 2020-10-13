import { Chunk } from './gameObjects/10_Chunk';
import { IndexedList } from './utils/IndexedList';
import { AbstractGameEntity } from './gameObjects/20_AbstractGameEntity';

export class GameScene {
    entities = new IndexedList<AbstractGameEntity>();
    chunks = new IndexedList<Chunk>();
    timeStart: number = new Date().getTime();

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

    getClosestEntityOfType(entity: AbstractGameEntity, type: any) {
        const closest = this.entities
            .filter((e) => e instanceof type)
            .getValues()
            .sort((a, b) => this.distance(entity, a) - this.distance(entity, b));

        if (closest[0]) {
            return {
                entity: closest[0],
                distance: this.distance(entity, closest[0]),
            };
        }
        return null;
    }

    private distance(a: AbstractGameEntity, b: AbstractGameEntity) {
        return Math.sqrt(Math.pow(a.position.x - b.position.x, 2) + Math.pow(a.position.y - b.position.y, 2));
    }

    getTime() {
        const REAL_TO_INGAME_TIME = 10 * 60;
        let time = (Math.abs(new Date().getTime() - this.timeStart) / 1000) * REAL_TO_INGAME_TIME + 12 * 60 * 60;

        return {
            day: time / (60 * 60 * 24),
            hour: (time / (60 * 60)) % 24,
            min: (time / 60) % 60,
            sec: time % 60,
        };
    }
}

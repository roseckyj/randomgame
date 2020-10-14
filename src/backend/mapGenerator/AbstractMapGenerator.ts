import { AbstractGameEntity } from '../../shared/gameObjects/20_AbstractGameEntity';
import { Chunk } from '../../shared/gameObjects/10_Chunk';
import { GameScene } from '../../shared/Scene';

export abstract class AbstractMapGenerator {
    constructor(
        protected scene: GameScene,
        protected getDirtyListener: () => (entity: AbstractGameEntity) => void,
        public seed: number = Math.floor(Math.random() * 10000000000),
    ) {}

    abstract async generateChunk(chunkX: number, chunkY: number): Promise<Chunk>;
}

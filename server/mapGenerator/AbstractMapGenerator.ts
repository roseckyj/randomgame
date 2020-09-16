import { Chunk } from "../../src/GameMechanics/gameObjects/Chunk";
import { GameScene } from "../../src/GameMechanics/gameObjects/Scene";

export abstract class AbstractMapGenerator {
    constructor(protected scene: GameScene, protected seed: number = Math.floor(Math.random() * 10000000000)) {}

    abstract async generateChunk(chunkX: number, chunkY: number): Promise<Chunk>;
}

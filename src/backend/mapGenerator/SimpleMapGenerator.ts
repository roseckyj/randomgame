import SimplexNoise from 'simplex-noise';
import { AbstractMapGenerator } from './AbstractMapGenerator';
import { uuid } from 'uuidv4';
import { Vector2 } from 'babylonjs';
import { Chunk } from '../../shared/gameObjects/10_Chunk';
import { Tree } from '../../shared/gameObjects/60_Tree';
import { Stone } from '../../shared/gameObjects/60_Stone';
import { ImmediateDeserializeController } from '../../shared/gameObjects/controllers/controllers/deserializers/ImmediateDeserializeController';

export class SimpleMapGenerator extends AbstractMapGenerator {
    simplex = new SimplexNoise(this.seed.toString());

    async generateChunk(chunkX: number, chunkY: number) {
        if (this.scene.chunks.includes(Chunk.getId(chunkX, chunkY))) {
            return this.scene.chunks.get(Chunk.getId(chunkX, chunkY))!;
        }

        let chunkData: number[][] = [];

        for (let x = 0; x < 16; x++) {
            chunkData[x] = [];
        }

        for (let x = 0; x < 16; x++) {
            for (let y = 0; y < 16; y++) {
                chunkData[x].push(this.getTerrainTile(chunkX * 16 + x, chunkY * 16 + y));
            }
        }

        //chunkData.forEach((row) => console.log(row.join("")));

        const chunk = new Chunk(this.scene, chunkX, chunkY);
        chunk.ground = chunkData;
        this.scene.chunks.add(Chunk.getId(chunkX, chunkY), chunk);

        return chunk;
    }

    getTerrainTile(x: number, y: number): number {
        const RANDOMNESS = 0.3;

        const WATER_SCALE = 0.01;
        const FORREST_SCALE = 0.01;

        const water = this.simplex.noise3D(x * WATER_SCALE, y * WATER_SCALE, 0);
        const forrest = this.simplex.noise2D(x * FORREST_SCALE, y * FORREST_SCALE + 100);

        if (water > 0.6) {
            if (water < 0.63 && forrest < -0.2) {
                //return 4; // Sand
                /* Disabled for now */
            }
            return 2; // Water
        }

        if (forrest > 0) {
            // Forrest
            if ((x + y) % 2 === 0 && Math.random() > 1 - forrest) {
                const tree = new Tree(this.scene, uuid());
                tree.position = new Vector2(
                    x + Math.random() * 2 * RANDOMNESS - RANDOMNESS - 8 + 0.5,
                    y + Math.random() * 2 * RANDOMNESS - RANDOMNESS - 8 + 0.5,
                );
                tree.controllerManager.attach(new ImmediateDeserializeController(tree));
                if (Math.random() > 0.5) {
                    tree.size = 4;
                } else if (Math.random() > 0.5) {
                    tree.size = 3;
                } else if (Math.random() > 0.5) {
                    tree.size = 2;
                } else {
                    tree.size = 1;
                }

                this.scene.entities.add(tree.id, tree);
            }
            return 1;
        }

        if (Math.random() > 0.995) {
            // Stone
            const stone = new Stone(this.scene, uuid());
            stone.position = new Vector2(
                x + Math.random() * 2 * RANDOMNESS - RANDOMNESS - 8 + 0.5,
                y + Math.random() * 2 * RANDOMNESS - RANDOMNESS - 8 + 0.5,
            );
            stone.size = Math.random() > 0.7 ? 1 : 2;
            stone.controllerManager.attach(new ImmediateDeserializeController(stone));
            this.scene.entities.add(stone.id, stone);
            return 1;
        }

        return 1; // Grass
    }
}

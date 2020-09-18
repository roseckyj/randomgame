import SimplexNoise from 'simplex-noise';
import { AbstractMapGenerator } from './AbstractMapGenerator';
import { uuid } from 'uuidv4';
import { Vector2 } from '@babylonjs/core';
import { Chunk } from '../../shared/gameObjects/Chunk';
import { Tree } from '../../shared/gameObjects/Tree';

export class SimpleMapGenerator extends AbstractMapGenerator {
    simplex = new SimplexNoise(this.seed.toString());

    async generateChunk(chunkX: number, chunkY: number) {
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
            if ((x + y) % 2 === 0 || forrest > 0.6) {
                const RANDOMNESS = 0.3;

                const tree = new Tree(this.scene, uuid());
                tree.position = new Vector2(
                    x + Math.random() * 2 * RANDOMNESS - RANDOMNESS,
                    y + Math.random() * 2 * RANDOMNESS - RANDOMNESS,
                );
                this.scene.entities.add(tree.id, tree);
            }
            return 1;
        }
        return 1; // Grass
    }
}

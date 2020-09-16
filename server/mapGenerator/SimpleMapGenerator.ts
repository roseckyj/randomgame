import SimplexNoise from 'simplex-noise';
import { AbstractMapGenerator } from './AbstractMapGenerator';
import { Chunk } from '../../src/GameMechanics/gameObjects/Chunk';

export class SimpleMapGenerator extends AbstractMapGenerator {
    simplex = new SimplexNoise(super.seed.toString());

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
        const WATER_SCALE = 0.004;
        const BIOME_SCALE = 0.0008;
        const FORREST_SCALE = 0.005;
    
        const river = this.simplex.noise3D(x * WATER_SCALE, y * WATER_SCALE, 0);
        const biome =
            (this.simplex.noise2D(x * BIOME_SCALE, y * BIOME_SCALE + 200) + this.simplex.noise2D(x * 0.02, y * 0.02 + 400) * 0.2) /
            1.2;
        const forrest = this.simplex.noise2D(x * FORREST_SCALE, y * FORREST_SCALE + 100);
    
        /*
        if (water > 0.7) {
            return 2; // Lake (water)
        }
        if (water > 0.6 && forrest < -0.3) {
            return 4; // Sand
        }
        if (forrest > 0.4) {
            return 3; // Forrest
        }
        return 1; // Grass
        */
    
        if (biome < -0.3) {
            // Ocean (water)
            if (forrest < -0.6 && river < -0.5) {
                // Island
                return 1;
            }
            return 2;
        }
    
        if (forrest < -0.7) {
            // Lake (water)
            return 2;
        }
        return 1; // Grass
    }
}

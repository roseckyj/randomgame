import { Vector3, Mesh, Scene, MeshBuilder, StandardMaterial, Texture, DynamicTexture, Vector2 } from '@babylonjs/core';
import { AbstractGameObject } from './AbstractGameObject';

export type tileType = number;

export interface serializedChunk {
    x: number;
    y: number;
    ground: tileType[][];
}

export class Chunk extends AbstractGameObject {
    ground: tileType[][] = [[]];

    constructor(x: number, y: number) {
        super();
        this.position = new Vector2(x, y);
    }

    get id(): string {
        return Chunk.getId(this.position.x, this.position.y);
    }

    serialize(): serializedChunk {
        return {
            x: this.position.x,
            y: this.position.y,
            ground: this.ground,
        };
    }

    deserialize(serialized: serializedChunk): void {
        this.position.x = serialized.x;
        this.position.y = serialized.y;
        this.ground = serialized.ground;

        this.updateMesh();
    }

    static getId(x: number, y: number): string {
        return x.toString() + 'x' + y.toString();
    }

    // ========== BABYLON ===========

    attachBabylon(scene: Scene) {
        super.attachBabylon(scene);

        this.mesh = MeshBuilder.CreatePlane(
            'chunk',
            { width: 1600, height: 1600, sideOrientation: Mesh.FRONTSIDE },
            this.scene,
        );
        this.updateMesh();

        return this;
    }

    async updateMesh() {
        if (!this.mesh || !this.scene) {
            return;
        }

        this.mesh.position = new Vector3(this.position.x * 16 * 100, -this.position.y * 16 * 100, 0);

        const texture = new DynamicTexture(
            'chunkTexture',
            { width: 1 * 16, height: 1 * 16 },
            this.scene,
            true,
            Texture.NEAREST_NEAREST,
        );

        const ctx = texture.getContext();

        for (let x = 0; x < 16; x++) {
            for (let y = 0; y < 16; y++) {
                if (this.ground[x] && this.ground[x][y]) {
                    ctx.fillStyle = Chunk.getTerrainColor(this.ground[x][y]);

                    ctx.fillRect(x, y, 1, 1);
                    if ((x + y) % 2 === 0) {
                        ctx.fillStyle = '#00000005';
                        ctx.fillRect(x, y, 1, 1);
                    }
                }
            }
        }

        texture.update();

        const material = new StandardMaterial('mat', this.scene);
        material.emissiveTexture = texture;
        this.mesh.material = material;
    }

    static getTerrainColor(number: number): string {
        switch (number) {
            case 1: // Grass
                return '#CFDA78';
            case 2: // Water
                return '#4EDCF0';
            case 3: // Forrest
                return '#6AA981';
            case 4: // Sand
                return '#FDDC86';
        }
        return '#DDDDDD';
    }
}

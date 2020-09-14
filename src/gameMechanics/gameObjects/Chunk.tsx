import { Vector3, Mesh, Scene, MeshBuilder, StandardMaterial, Texture, DynamicTexture } from '@babylonjs/core';
import { serializedGameObject } from './GameObject';
import { drawTexture, TEXTURE_RESOLUTION, createTexture } from '../textures/textureEngine';
import { textures } from '../textures/rexturePack';

export type tileType = number;

export interface serializedChunk {
    x: number;
    y: number;
    ground: tileType[][];
    objects: serializedGameObject[];
}

export class Chunk {
    private ground: tileType[][] = [[]];
    // private objects: GameObject[];

    private upToDate: boolean = false;

    private mesh: Mesh;

    constructor(private scene: Scene, public x: number, public y: number) {
        this.mesh = MeshBuilder.CreatePlane(
            'chunk',
            { width: 1600, height: 1600, sideOrientation: Mesh.FRONTSIDE },
            this.scene,
        );
        this.updateMesh();
    }

    get id(): string {
        return Chunk.getId(this.x, this.y);
    }

    serialize(): serializedChunk {
        return {
            x: this.x,
            y: this.y,
            ground: this.ground,
            objects: [], //TODO
        };
    }

    deserialize(serialized: serializedChunk): void {
        this.x = serialized.x;
        this.y = serialized.y;
        this.ground = serialized.ground;
        // this.objects = [] // TODO: map => GameObject.deserialize();

        this.upToDate = true;
        console.log(this.ground);
        this.updateMesh();
    }

    async updateMesh() {
        this.mesh.position = new Vector3(this.x * 16 * 100, -this.y * 16 * 100, 0);

        //const texture = createTexture('grass_01', this.scene);

        const texture = new DynamicTexture(
            'chunkTexture',
            { width: 1 * 16, height: 1 * 16 },
            this.scene,
            true,
            Texture.NEAREST_NEAREST,
        );

        const ctx = texture.getContext();

        ctx.fillStyle = '#CFDA78';
        ctx.fillRect(0, 0, texture.getSize().width, texture.getSize().height);

        ctx.fillStyle = '#00000005';
        for (let x = 0; x < 16; x++) {
            for (let y = 0; y < 16; y++) {
                if ((x + y) % 2 === 0) {
                    ctx.fillRect(x, y, 1, 1);
                }
            }
        }

        /*
        for (let i = 0; i < 20; i++) {
            const rnd = (Math.floor(Math.random() * 100) % 3) + 1;
            const x = Math.random() * 15 * TEXTURE_RESOLUTION;
            const y = Math.random() * 15 * TEXTURE_RESOLUTION;

            if (this.ground.length === 16 && this.ground[0].length === 16) {
                switch (this.ground[Math.floor(x / 16)][Math.floor(y / 16)]) {
                    case 1:
                        // Grass
                        drawTexture(ctx, 'grass_0' + rnd, x, y);
                        break;
                    default:
                        continue;
                }
            }
        }
        */

        texture.update();

        const material = new StandardMaterial('mat', this.scene);
        material.emissiveTexture = texture;
        this.mesh.material = material;
    }

    setVisibility(visible: boolean) {
        this.mesh.setEnabled(visible);
    }

    static getId(x: number, y: number): string {
        return x.toString() + 'x' + y.toString();
    }
}

import { Vector3, Mesh, Color3, Scene, MeshBuilder, StandardMaterial, Texture, DynamicTexture } from '@babylonjs/core';
import { serializedGameObject } from './GameObject';
import { IMAGES } from '../utils/textures';

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
            { width: 1600, height: 1600, sideOrientation: Mesh.BACKSIDE },
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

        this.updateMesh();
    }

    updateMesh() {
        this.mesh.position = new Vector3(this.x * 16 * 100, this.y * 16 * 100, -0.1);
        this.mesh.rotation = new Vector3(0, 0, Math.PI);

        const texture = new DynamicTexture(
            'chunkTexture',
            { width: 16 * 16, height: 16 * 16 },
            this.scene,
            true,
            Texture.NEAREST_NEAREST,
        );

        const ctx = texture.getContext();

        this.ground.forEach((col, x) =>
            col.forEach((cell, y) => {
                ctx.drawImage(IMAGES.grass, x * 16, y * 16, 16, 16);
            }),
        );

        texture.update();

        const material = new StandardMaterial('mat', this.scene);
        material.diffuseTexture = texture;
        this.mesh.material = material;
    }

    setVisibility(visible: boolean) {
        this.mesh.setEnabled(visible);
    }

    static getId(x: number, y: number): string {
        return x.toString() + 'x' + y.toString();
    }
}

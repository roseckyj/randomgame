import { Vector3, Mesh, Scene, MeshBuilder, Vector2 } from 'babylonjs';
import { createMaterial, getSimpleMaterial } from '../../frontend/gameMechanics/textures/textureEngine';
import { GameScene } from './Scene';
import { AbstractGameEntity, serializedEntity } from './01_AbstractGameEntity';
import { SimpleTexture } from '../../frontend/gameMechanics/textures/SimpleTexture';

export interface serializedStone {
    size: 1 | 2;
}

export class Stone extends AbstractGameEntity {
    private texture: SimpleTexture;
    public size: 1 | 2;

    constructor(gameScene: GameScene, public id: string) {
        super(gameScene);
    }

    serialize(): serializedEntity<serializedStone> {
        let sup = super.serialize() as serializedEntity<serializedStone>;
        sup.type = Stone.type;
        sup.data = {
            size: this.size,
        };
        return sup;
    }

    deserialize(serialized: serializedEntity<serializedStone>, dirty: boolean): void {
        if (serialized.type !== Stone.type) return;

        this.position.x = serialized.x;
        this.position.y = serialized.y;
        this.size = serialized.data.size;
        super.deserialize(serialized, dirty);
    }

    tick(deltaTime: number) {}

    static get type() {
        return 'stone';
    }

    // ========== BABYLON ===========

    attachBabylon(scene: Scene) {
        super.attachBabylon(scene);

        if (!this.babylonScene) return this;

        const size = this.getSize();

        this.mesh = MeshBuilder.CreatePlane(
            'stone',
            { width: size.x, height: size.y, sideOrientation: Mesh.FRONTSIDE },
            this.babylonScene,
        );
        this.mesh.material = getSimpleMaterial(this.size === 1 ? 'rock_small' : 'rock_big', this.babylonScene);

        this.updateMesh();
        return this;
    }

    async updateMesh() {
        if (!this.mesh || !this.babylonScene) return;
        this.mesh.material = getSimpleMaterial(this.size === 1 ? 'rock_small' : 'rock_big', this.babylonScene);
        super.updateMesh();
    }

    detachBabylon() {
        // Mesh detached by super
        return super.detachBabylon();
    }

    getSize() {
        return new Vector2(100, 100);
    }
}

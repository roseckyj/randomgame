import { Vector3, Mesh, Scene, MeshBuilder } from '@babylonjs/core';
import { createMaterial } from '../../frontend/gameMechanics/textures/textureEngine';
import { GameScene } from './Scene';
import { AbstractGameEntity, serializedEntity } from './01_AbstractGameEntity';
import { SimpleTexture } from '../../frontend/gameMechanics/textures/SimpleTexture';

export interface serializedTree {
    size: 1 | 2;
}

export class Tree extends AbstractGameEntity {
    private texture: SimpleTexture;
    private size: 1 | 2;

    constructor(gameScene: GameScene, public id: string) {
        super(gameScene);
    }

    serialize(): serializedEntity<serializedTree> {
        let sup = super.serialize() as serializedEntity<serializedTree>;
        sup.type = Tree.type;
        sup.data = {
            size: this.size,
        };
        return sup;
    }

    deserialize(serialized: serializedEntity<serializedTree>, dirty: boolean): void {
        if (serialized.type !== Tree.type) return;

        this.position.x = serialized.x;
        this.position.y = serialized.y;
        this.size = serialized.data.size;
        super.deserialize(serialized, dirty);
    }

    tick(deltaTime: number) {}

    // ========== BABYLON ===========

    attachBabylon(scene: Scene) {
        super.attachBabylon(scene);

        if (!this.babylonScene) return this;

        this.mesh = MeshBuilder.CreatePlane(
            'tree',
            { width: 100, height: 200, sideOrientation: Mesh.FRONTSIDE },
            this.babylonScene,
        );
        this.texture = new SimpleTexture(this.size === 1 ? 'tree_small' : 'tree_big', this.babylonScene);
        this.mesh.material = createMaterial(this.texture.getTexture(), this.babylonScene);

        this.updateMesh();
        return this;
    }

    async updateMesh() {
        if (!this.mesh) return;
        this.mesh.position = new Vector3(this.position.x, -this.position.y, -1);
    }

    detachBabylon() {
        this.texture.detach();

        if (this.babylonScene && this.mesh && this.mesh.material) {
            this.babylonScene.removeMaterial(this.mesh.material);
        }

        // Mesh detached by super
        return super.detachBabylon();
    }

    static get type() {
        return 'tree';
    }
}

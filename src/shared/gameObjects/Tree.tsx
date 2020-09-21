import { Mesh, Scene, MeshBuilder, Vector2 } from 'babylonjs';
import { getSimpleMaterial } from '../../frontend/gameMechanics/textures/textureEngine';
import { GameScene } from './Scene';
import { AbstractGameEntity, serializedEntity } from './01_AbstractGameEntity';
import { SimpleTexture } from '../../frontend/gameMechanics/textures/SimpleTexture';

type treeTypes = 1 | 2 | 3 | 4;

export interface serializedTree {
    size: treeTypes;
}

export class Tree extends AbstractGameEntity {
    private texture: SimpleTexture;
    public size: treeTypes;

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

    static get type() {
        return 'tree';
    }

    // ========== BABYLON ===========

    attachBabylon(scene: Scene) {
        super.attachBabylon(scene);

        if (!this.babylonScene) return this;

        const size = this.getSize();

        this.mesh = MeshBuilder.CreatePlane(
            'tree',
            { width: size.x, height: size.y, sideOrientation: Mesh.FRONTSIDE },
            this.babylonScene,
        );
        this.setMaterial();

        this.updateMesh();
        return this;
    }

    async updateMesh() {
        if (!this.mesh || !this.babylonScene) return;
        this.setMaterial();
        super.updateMesh();
    }

    setMaterial() {
        if (this.mesh && this.babylonScene) {
            switch (this.size) {
                case 1:
                    this.mesh.material = getSimpleMaterial('tree_small', this.babylonScene);
                    break;
                case 2:
                    this.mesh.material = getSimpleMaterial('tree_big', this.babylonScene);
                    break;
                case 3:
                    this.mesh.material = getSimpleMaterial('tree_short', this.babylonScene);
                    break;
                case 4:
                    this.mesh.material = getSimpleMaterial('tree_tall', this.babylonScene);
                    break;
            }
        }
    }

    detachBabylon() {
        // Mesh detached by super
        return super.detachBabylon();
    }

    getSize() {
        return new Vector2(200, 400);
    }
}

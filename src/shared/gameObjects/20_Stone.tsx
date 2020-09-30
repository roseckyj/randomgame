import { Mesh, Scene, MeshBuilder, Vector2 } from 'babylonjs';
import { getSimpleMaterial } from '../../frontend/gameMechanics/textures/textureEngine';
import { GameScene } from '../Scene';
import { AbstractGameEntity, serializedEntity } from './01_AbstractGameEntity';
import { SimpleTexture } from '../../frontend/gameMechanics/textures/SimpleTexture';

export interface serializedStone {
    size: 1 | 2;
}

export class Stone extends AbstractGameEntity {
    public hitbox = { width: 0.2, height: 0.2 };

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

    deserialize(serialized: serializedEntity<serializedStone>): void {
        if (serialized.type !== Stone.type) return;

        this.position.x = serialized.x;
        this.position.y = serialized.y;
        this.size = serialized.data.size;
        super.deserialize(serialized);
    }

    tick(deltaTime: number) {}

    static get type() {
        return 'stone';
    }

    // ========== BABYLON ===========

    async attachBabylon(scene: Scene) {
        if (this.babylonScene) return;
        await super.attachBabylon(scene);

        if (!this.babylonScene) return;

        const size = this.getSize();

        this.mesh = MeshBuilder.CreatePlane(
            'stone ' + this.id,
            { width: size.x, height: size.y, sideOrientation: Mesh.FRONTSIDE },
            this.babylonScene,
        );
        this.mesh.material = getSimpleMaterial(this.size === 1 ? 'rock_small' : 'rock_big', this.babylonScene);

        this.updateMesh();
    }

    async updateMesh() {
        if (!this.mesh || !this.babylonScene) return;
        this.mesh.material = getSimpleMaterial(this.size === 1 ? 'rock_small' : 'rock_big', this.babylonScene);
        super.updateMesh();
    }

    async detachBabylon() {
        // Mesh detached by super
        super.detachBabylon();
    }

    getSize() {
        return new Vector2(100, 100);
    }
}

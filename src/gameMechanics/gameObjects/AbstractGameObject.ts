import { Mesh, Vector2, Scene } from '@babylonjs/core';

export abstract class AbstractGameObject {
    protected scene: Scene | null = null;
    protected mesh: Mesh | null = null;
    public position: Vector2 = Vector2.Zero();

    attachBabylon(scene: Scene): AbstractGameObject {
        this.scene = scene;

        return this;
    }

    abstract serialize(): any;

    abstract deserialize(serialized: any): void;

    tick(deltaTime: number): void {}

    abstract async updateMesh(): Promise<void>;

    setVisibility(visible: boolean) {
        if (this.mesh) this.mesh.setEnabled(visible);
    }

    abstract get id(): string;
}

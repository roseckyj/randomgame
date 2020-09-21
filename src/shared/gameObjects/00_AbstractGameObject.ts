import { Mesh, Vector2, Scene } from 'babylonjs';
import { GameScene } from './Scene';

export abstract class AbstractGameObject {
    protected babylonScene: Scene | null = null;
    protected mesh: Mesh | null = null;
    public position: Vector2 = Vector2.Zero();

    constructor(protected gameScene: GameScene) {}

    attachBabylon(babylonScene: Scene): AbstractGameObject {
        this.babylonScene = babylonScene;

        return this;
    }

    detachBabylon(): AbstractGameObject {
        if (this.babylonScene && this.mesh) {
            this.babylonScene.removeMesh(this.mesh, true);
            this.babylonScene = null;
        }

        return this;
    }

    abstract serialize(): any;

    abstract deserialize(serialized: any, dirty: boolean, smooth?: boolean): void;

    tick(deltaTime: number): void {}

    abstract async updateMesh(): Promise<void>;

    setVisibility(visible: boolean) {
        if (this.mesh) this.mesh.setEnabled(visible);
    }

    abstract get id(): string;
}

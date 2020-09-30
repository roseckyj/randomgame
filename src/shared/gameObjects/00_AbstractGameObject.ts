import { Mesh, Vector2, Scene } from 'babylonjs';
import { GameScene } from '../Scene';

export abstract class AbstractGameObject {
    protected babylonScene: Scene | null = null;
    protected mesh: Mesh | null = null;
    public position: Vector2 = Vector2.Zero();

    constructor(protected gameScene: GameScene) {}

    async attachBabylon(babylonScene: Scene): Promise<void> {
        this.babylonScene = babylonScene;
    }

    async detachBabylon(): Promise<void> {
        if (this.babylonScene && this.mesh) {
            this.babylonScene.removeMesh(this.mesh, true);
            this.babylonScene = null;
        }
    }

    abstract serialize(): any;

    abstract deserialize(serialized: any, smooth?: boolean): void;

    tick(deltaTime: number): void {}

    abstract async updateMesh(): Promise<void>;

    setVisibility(visible: boolean) {
        if (this.mesh) this.mesh.setEnabled(visible);
    }

    getVisibility() {
        return !!this.mesh && this.mesh.isEnabled();
    }

    abstract get id(): string;
}

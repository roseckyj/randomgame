import { Vector2, Scene } from 'babylonjs';
import { GameScene } from '../Scene';
import { AbstractRenderer } from './renderers/00_AbstractRenderer';

export abstract class AbstractGameObject {
    protected renderer: AbstractRenderer | null = null;
    public position: Vector2 = Vector2.Zero();
    protected visibility: boolean = true;

    constructor(public gameScene: GameScene) {}

    abstract serialize(): any;

    abstract deserialize(serialized: any, smooth?: boolean): void;

    async attachRenderer(babylonScene: Scene) {
        if (this.renderer && this.renderer.attached) {
            this.renderer.detach();
        }
    }

    async detachRenderer(): Promise<void> {
        if (this.renderer) this.renderer.detach();
    }

    protected update() {
        if (this.renderer) {
            this.renderer.update();
        }
    }

    tick(deltaTime: number): void {}

    setVisibility(visible: boolean) {
        this.visibility = visible;
        if (this.renderer) this.renderer.update();
    }

    getVisibility() {
        return this.visibility;
    }

    abstract get id(): string;
}

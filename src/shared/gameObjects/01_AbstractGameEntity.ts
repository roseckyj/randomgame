import { Scene, Vector2 } from 'babylonjs';
import { AbstractGameObject } from './00_AbstractGameObject';
import { AbstractController } from './controllers/00_AbstractController';

export interface serializedEntity<T> {
    id: string;
    x: number;
    y: number;
    type: string;
    data: T;
}

export abstract class AbstractGameEntity extends AbstractGameObject {
    // Should be used for all entities, buildings, trees, etc.

    public controller: AbstractController | null = null;
    public disabled: boolean = false;
    public hitbox: { width: number; height: number } = { width: 0, height: 0 };

    serialize(): serializedEntity<{}> {
        return {
            id: this.id,
            x: this.position.x,
            y: this.position.y,
            type: AbstractGameEntity.type,
            data: {},
        };
    }

    deserialize(serialized: any, smooth?: boolean): void {
        this.update();
    }

    abstract getSize(): Vector2;

    static get type(): string {
        return 'unknown';
    }

    public async setVisibilityAttachRenderer(visible: boolean, babylonScene: Scene) {
        super.setVisibility(visible);
        if (visible && !this.renderer) this.attachRenderer(babylonScene);
    }

    public colidesWith(entity: AbstractGameEntity) {
        return (
            this.position.x - this.hitbox.width < entity.position.x + entity.hitbox.width &&
            this.position.x + this.hitbox.width > entity.position.x - entity.hitbox.width &&
            this.position.y - this.hitbox.height < entity.position.y + entity.hitbox.height &&
            this.position.y + this.hitbox.height > entity.position.y - entity.hitbox.height
        );
    }

    tick(deltaTime: number): void {
        if (this.controller) {
            this.controller.tick(deltaTime);
        }
    }
}

import { Scene, Vector2 } from 'babylonjs';
import { CAMERA_ANGLE } from '../constants';
import { AbstractGameObject } from './00_AbstractGameObject';

export interface serializedEntity<T> {
    id: string;
    x: number;
    y: number;
    type: string;
    data: T;
}

export abstract class AbstractGameEntity extends AbstractGameObject {
    // Should be used for all entities, buildings, trees, etc.

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
        this.updateMesh();
    }

    public async updateMesh(): Promise<void> {
        if (this.mesh) {
            this.mesh.position.z = -(this.getSize().y * Math.cos(CAMERA_ANGLE)) / 2;
            this.mesh.rotation.x = -CAMERA_ANGLE;

            this.mesh.position.x = this.position.x * 100;
            this.mesh.position.y = -this.position.y * 100 + (this.getSize().y * Math.sin(CAMERA_ANGLE)) / 2;

            this.mesh.isPickable = true;
        }
    }

    abstract getSize(): Vector2;

    static get type(): string {
        return 'unknown';
    }

    public async setVisibilityAttachBabylon(visible: boolean, babylonScene: Scene) {
        super.setVisibility(visible);
        if (visible && !this.babylonScene) this.attachBabylon(babylonScene);
    }

    public colidesWith(entity: AbstractGameEntity) {
        return (
            this.position.x - this.hitbox.width < entity.position.x + entity.hitbox.width &&
            this.position.x + this.hitbox.width > entity.position.x - entity.hitbox.width &&
            this.position.y - this.hitbox.height < entity.position.y + entity.hitbox.height &&
            this.position.y + this.hitbox.height > entity.position.y - entity.hitbox.height
        );
    }

    public mouseDown() {
        console.log(this, 'down');
    }

    public mouseUp() {
        console.log(this, 'up');
    }
}

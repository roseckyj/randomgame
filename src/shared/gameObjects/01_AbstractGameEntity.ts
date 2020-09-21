import { Vector2 } from 'babylonjs';
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

    public dirty: boolean = true;
    public server_dead: boolean = false;

    serialize(): serializedEntity<{}> {
        return {
            id: this.id,
            x: this.position.x,
            y: this.position.y,
            type: AbstractGameEntity.type,
            data: {},
        };
    }

    deserialize(serialized: any, dirty: boolean, smooth?: boolean): void {
        this.updateMesh();
        if (dirty) this.dirty = true;
    }

    public clean() {
        this.dirty = false;
    }

    public server_kill() {
        this.dirty = true;
        this.server_dead = true;
    }

    public async updateMesh(): Promise<void> {
        if (this.mesh) {
            this.mesh.position.z = -(this.getSize().y * Math.cos(CAMERA_ANGLE)) / 2;
            this.mesh.rotation.x = -CAMERA_ANGLE;

            this.mesh.position.x = this.position.x * 100;
            this.mesh.position.y = -this.position.y * 100 + (this.getSize().y * Math.sin(CAMERA_ANGLE)) / 2;
        }
    }

    abstract getSize(): Vector2;

    static get type(): string {
        return 'unknown';
    }
}

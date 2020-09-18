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

    static get type(): string {
        return 'unknown';
    }
}

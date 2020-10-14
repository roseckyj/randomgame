import { Scene, Vector2 } from 'babylonjs';
import { GameScene } from '../Scene';
import { AbstractGameObject } from './00_AbstractGameObject';
import { ControllerManager } from './controllers/ControllerManager';

export interface serializedEntity<T> {
    id: string;
    x: number;
    y: number;
    velocityX: number;
    velocityY: number;
    type: string;
    data: T;
}

export enum Platform {
    Server = 'SERVER',
    Client = 'CLIENT',
}

export abstract class AbstractGameEntity extends AbstractGameObject {
    // Should be used for all entities, buildings, trees, etc.

    public disabled: boolean = false;
    public hitbox: { width: number; height: number } = { width: 0, height: 0 };
    public velocity: Vector2 = Vector2.Zero();

    public controllerManager: ControllerManager;

    private dirtyListeners: ((entity: AbstractGameEntity) => void)[] = [];

    constructor(public gameScene: GameScene, public id: string) {
        super(gameScene);
    }

    serialize(): serializedEntity<{}> {
        return {
            id: this.id,
            x: this.position.x,
            y: this.position.y,
            velocityX: this.velocity.x,
            velocityY: this.velocity.y,
            type: AbstractGameEntity.type,
            data: {},
        };
    }

    deserializeImmediatelly(serialized: any): void {
        this.position.x = serialized.x;
        this.position.y = serialized.y;
        this.velocity.x = serialized.velocityX;
        this.velocity.y = serialized.velocityY;
        this.deserialize(serialized);
        this.update();
        this.setDirty();
    }

    deserialize(serialized: any): void {
        this.controllerManager.invoke('deserialize', serialized);
        this.update();
        this.setDirty();
    }

    abstract attachControllers(platform: Platform): void;

    attachDirtyListener(listener: (entity: AbstractGameEntity) => void) {
        this.dirtyListeners.push(listener);
    }

    public setDirty() {
        this.dirtyListeners.forEach((listener) => listener(this));
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
        this.controllerManager.invoke('tick', deltaTime);
    }
}

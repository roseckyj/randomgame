import { Scene, Vector2 } from 'babylonjs';
import { GameScene } from '../Scene';
import { AbstractGameEntity, Platform, serializedEntity } from './20_AbstractGameEntity';
import { ControllerManager } from './controllers/ControllerManager';
import { ImmediateDeserializeController } from './controllers/controllers/deserializers/ImmediateDeserializeController';
import { StaticRenderer } from './renderers/11_StaticRenderer';

export interface serializedStone {
    size: 1 | 2;
}

export class Stone extends AbstractGameEntity {
    public hitbox = { width: 0.2, height: 0.2 };

    public size: 1 | 2;

    constructor(gameScene: GameScene, public id: string) {
        super(gameScene, id);

        this.controllerManager = new ControllerManager();
    }

    serialize(): serializedEntity<serializedStone> {
        let sup = super.serialize() as serializedEntity<serializedStone>;
        sup.type = Stone.type;
        sup.data = {
            size: this.size,
        };
        return sup;
    }

    deserialize(serialized: serializedEntity<serializedStone>, timestamp: number): void {
        if (serialized.type !== Stone.type || timestamp < this.updatedAt) return;

        this.size = serialized.data.size;
        super.deserialize(serialized, timestamp);
    }

    static get type() {
        return 'stone';
    }

    async attachRenderer(scene: Scene) {
        super.attachRenderer(scene);

        this.renderer = new StaticRenderer(this, scene, () => (this.size === 1 ? 'rock_small' : 'rock_big'));
    }

    attachControllers(platform: Platform) {
        if (platform === Platform.Server) {
            this.controllerManager.attach(new ImmediateDeserializeController(this));
        }
        if (platform === Platform.Client) {
            this.controllerManager.attach(new ImmediateDeserializeController(this));
        }
    }

    getSize() {
        return new Vector2(100, 100);
    }
}

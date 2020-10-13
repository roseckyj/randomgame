import { Scene, Vector2 } from 'babylonjs';
import { GameScene } from '../Scene';
import { AbstractGameEntity, Platform, serializedEntity } from './20_AbstractGameEntity';
import { ControllerManager } from './controllers/ControllerManager';
import { ImmediateDeserializeController } from './controllers/controllers/deserializers/ImmediateDeserializeController';
import { SimpleRenderer } from './renderers/10_SimpleRenderer';
import { StaticRenderer } from './renderers/11_StaticRenderer';

export interface serializedChicken {}

export class Chicken extends AbstractGameEntity {
    public hitbox = { width: 0.2, height: 0.2 };

    constructor(gameScene: GameScene, public id: string) {
        super(gameScene, id);

        this.controllerManager = new ControllerManager();
    }

    serialize(): serializedEntity<serializedChicken> {
        let sup = super.serialize() as serializedEntity<serializedChicken>;
        sup.type = Chicken.type;
        sup.data = {};
        return sup;
    }

    deserialize(serialized: serializedEntity<serializedChicken>): void {
        if (serialized.type !== Chicken.type) return;

        super.deserialize(serialized);
    }

    static get type() {
        return 'chicken';
    }

    async attachRenderer(scene: Scene) {
        super.attachRenderer(scene);

        this.renderer = new SimpleRenderer(this, scene, 'chicken');
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

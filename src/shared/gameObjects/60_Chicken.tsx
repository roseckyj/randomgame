import { Scene, Vector2 } from 'babylonjs';
import { GameScene } from '../Scene';
import { AbstractGameEntity, Platform, serializedEntity } from './20_AbstractGameEntity';
import { ControllerManager } from './controllers/ControllerManager';
import { ChickenAIController } from './controllers/controllers/ai/ChickenAIController';
import { ImmediateDeserializeController } from './controllers/controllers/deserializers/ImmediateDeserializeController';
import { SmoothDeserializeController } from './controllers/controllers/deserializers/SmoothDeserializeController';
import { SimpleRenderer } from './renderers/10_SimpleRenderer';

export interface serializedChicken {
    inLove: string;
}

export class Chicken extends AbstractGameEntity {
    public hitbox = { width: 0.2, height: 0.2 };

    public inLove: string = '';

    constructor(gameScene: GameScene, public id: string) {
        super(gameScene, id);

        this.controllerManager = new ControllerManager();
    }

    serialize(): serializedEntity<serializedChicken> {
        let sup = super.serialize() as serializedEntity<serializedChicken>;
        sup.type = Chicken.type;
        sup.data = {
            inLove: this.inLove,
        };
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
            this.controllerManager.attach(new ChickenAIController(this));
        }
        if (platform === Platform.Client) {
            this.controllerManager.attach(new SmoothDeserializeController(this));
            this.controllerManager.invoke('setSmoothTime', 200);
        }
    }

    getSize() {
        return new Vector2(100, 100);
    }
}

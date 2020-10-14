import { Scene, Vector2 } from 'babylonjs';
import { GameScene } from '../Scene';
import { AbstractGameEntity, Platform, serializedEntity } from './20_AbstractGameEntity';
import { ControllerManager } from './controllers/ControllerManager';
import { ImmediateDeserializeController } from './controllers/controllers/deserializers/ImmediateDeserializeController';
import { SmoothDeserializeController } from './controllers/controllers/deserializers/SmoothDeserializeController';
import { KeyboardMotionController } from './controllers/controllers/input/KeyboardController';
import { PlayerRenderer } from './renderers/60_PlayerRenderer';

export interface serializedPlayer {
    name: string;
}

export class Player extends AbstractGameEntity {
    public hitbox = { width: 0.5, height: 0.2 };

    public name = '';

    constructor(gameScene: GameScene, public id: string) {
        super(gameScene, id);

        this.controllerManager = new ControllerManager();
    }

    serialize(): serializedEntity<serializedPlayer> {
        let sup = super.serialize() as serializedEntity<serializedPlayer>;
        sup.type = Player.type;
        sup.data = {
            name: this.name,
        };
        return sup;
    }

    deserialize(serialized: serializedEntity<serializedPlayer>, timestamp: number): void {
        if (serialized.type !== Player.type || timestamp < this.updatedAt) return;

        this.name = serialized.data.name;
        super.deserialize(serialized, timestamp);
    }

    tick(deltaTime: number) {
        super.tick(deltaTime);
        this.update();
    }

    static get type() {
        return 'player';
    }

    async attachRenderer(scene: Scene) {
        super.attachRenderer(scene);

        this.renderer = new PlayerRenderer(this, scene);
    }

    attachControllers(platform: Platform, me?: boolean) {
        if (platform === Platform.Server) {
            this.controllerManager.attach(new ImmediateDeserializeController(this));
        }
        if (platform === Platform.Client) {
            if (me) {
                this.controllerManager.attach(new KeyboardMotionController(this));
            } else {
                this.controllerManager.attach(new SmoothDeserializeController(this));
            }
        }
    }

    getSize() {
        return new Vector2(100, 200);
    }
}

import { Scene, Vector2 } from 'babylonjs';
import { GameScene } from '../Scene';
import { AbstractGameEntity, serializedEntity } from './20_AbstractGameEntity';
import { ControllerManager } from './controllers/ControllerManager';
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

    deserialize(serialized: serializedEntity<serializedPlayer>): void {
        if (serialized.type !== Player.type) return;

        this.name = serialized.data.name;
        super.deserialize(serialized);
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

    getSize() {
        return new Vector2(100, 200);
    }
}

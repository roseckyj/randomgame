import { Scene, Vector2 } from 'babylonjs';
import { GameScene } from '../Scene';
import { AbstractGameEntity, serializedEntity } from './01_AbstractGameEntity';
import { PlayerController } from './controllers/60_PlayerController';
import { PlayerRenderer } from './renderers/60_PlayerRenderer';

export interface serializedPlayer {
    velocityX: number;
    velocityY: number;
    name: string;
}

export class Player extends AbstractGameEntity {
    public hitbox = { width: 0.5, height: 0.2 };

    public velocityX: number = 0;
    public velocityY: number = 0;

    public name = '';

    public controller: PlayerController;

    constructor(gameScene: GameScene, public id: string) {
        super(gameScene);

        this.controller = new PlayerController(this);
    }

    serialize(): serializedEntity<serializedPlayer> {
        let sup = super.serialize() as serializedEntity<serializedPlayer>;
        sup.type = Player.type;
        sup.data = {
            velocityX: this.velocityX,
            velocityY: this.velocityY,
            name: this.name,
        };
        return sup;
    }

    deserialize(serialized: serializedEntity<serializedPlayer>, smooth?: boolean): void {
        this.name = serialized.data.name;

        if (smooth) {
            this.controller.ease(serialized.x, serialized.y, serialized.data.velocityX, serialized.data.velocityY);
        } else {
            this.controller.immediately(
                serialized.x,
                serialized.y,
                serialized.data.velocityX,
                serialized.data.velocityY,
            );
        }

        super.deserialize(serialized, smooth);
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

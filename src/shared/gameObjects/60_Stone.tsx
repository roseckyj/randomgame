import { Scene, Vector2 } from 'babylonjs';
import { GameScene } from '../Scene';
import { AbstractGameEntity, serializedEntity } from './01_AbstractGameEntity';
import { StaticRenderer } from './renderers/11_StaticRenderer';

export interface serializedStone {
    size: 1 | 2;
}

export class Stone extends AbstractGameEntity {
    public hitbox = { width: 0.2, height: 0.2 };

    public size: 1 | 2;

    constructor(gameScene: GameScene, public id: string) {
        super(gameScene);
    }

    serialize(): serializedEntity<serializedStone> {
        let sup = super.serialize() as serializedEntity<serializedStone>;
        sup.type = Stone.type;
        sup.data = {
            size: this.size,
        };
        return sup;
    }

    deserialize(serialized: serializedEntity<serializedStone>): void {
        if (serialized.type !== Stone.type) return;

        this.position.x = serialized.x;
        this.position.y = serialized.y;
        this.size = serialized.data.size;
        super.deserialize(serialized);
    }

    static get type() {
        return 'stone';
    }

    async attachRenderer(scene: Scene) {
        super.attachRenderer(scene);

        this.renderer = new StaticRenderer(this, scene, () => (this.size === 1 ? 'rock_small' : 'rock_big'));
    }

    getSize() {
        return new Vector2(100, 100);
    }
}

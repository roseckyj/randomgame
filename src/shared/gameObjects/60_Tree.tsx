import { Scene, Vector2 } from 'babylonjs';
import { GameScene } from '../Scene';
import { AbstractGameEntity, serializedEntity } from './01_AbstractGameEntity';
import { StaticRenderer } from './renderers/11_StaticRenderer';

type treeTypes = 1 | 2 | 3 | 4;

export interface serializedTree {
    size: treeTypes;
}

export class Tree extends AbstractGameEntity {
    public hitbox = { width: 0.2, height: 0.2 };

    public size: treeTypes;

    constructor(gameScene: GameScene, public id: string) {
        super(gameScene);
    }

    serialize(): serializedEntity<serializedTree> {
        let sup = super.serialize() as serializedEntity<serializedTree>;
        sup.type = Tree.type;
        sup.data = {
            size: this.size,
        };
        return sup;
    }

    deserialize(serialized: serializedEntity<serializedTree>): void {
        if (serialized.type !== Tree.type) return;

        this.position.x = serialized.x;
        this.position.y = serialized.y;
        this.size = serialized.data.size;
        super.deserialize(serialized);
    }

    static get type() {
        return 'tree';
    }

    async attachRenderer(scene: Scene) {
        super.attachRenderer(scene);

        this.renderer = new StaticRenderer(this, scene, () => this.getMaterial());
    }

    getMaterial() {
        switch (this.size) {
            case 1:
                return 'tree_small';
            case 2:
                return 'tree_big';
            case 3:
                return 'tree_short';
            case 4:
                return 'tree_tall';
        }
    }

    getSize() {
        return new Vector2(200, 400);
    }
}

import { Scene, Vector2 } from 'babylonjs';
import { GameScene } from '../Scene';
import { AbstractGameEntity, Platform, serializedEntity } from './20_AbstractGameEntity';
import { ControllerManager } from './controllers/ControllerManager';
import { ImmediateDeserializeController } from './controllers/controllers/deserializers/ImmediateDeserializeController';
import { StaticRenderer } from './renderers/11_StaticRenderer';

type treeTypes = 1 | 2 | 3 | 4;

export interface serializedTree {
    size: treeTypes;
}

export class Tree extends AbstractGameEntity {
    public hitbox = { width: 0.2, height: 0.2 };

    public size: treeTypes;

    constructor(gameScene: GameScene, public id: string) {
        super(gameScene, id);

        this.controllerManager = new ControllerManager();
    }

    serialize(): serializedEntity<serializedTree> {
        let sup = super.serialize() as serializedEntity<serializedTree>;
        sup.type = Tree.type;
        sup.data = {
            size: this.size,
        };
        return sup;
    }

    deserialize(serialized: serializedEntity<serializedTree>, timestamp: number): void {
        if (serialized.type !== Tree.type || timestamp < this.updatedAt) return;

        this.size = serialized.data.size;
        super.deserialize(serialized, timestamp);
    }

    static get type() {
        return 'tree';
    }

    async attachRenderer(scene: Scene) {
        super.attachRenderer(scene);

        this.renderer = new StaticRenderer(this, scene, () => this.getMaterial());
    }

    attachControllers(platform: Platform) {
        if (platform === Platform.Server) {
            this.controllerManager.attach(new ImmediateDeserializeController(this));
        }
        if (platform === Platform.Client) {
            this.controllerManager.attach(new ImmediateDeserializeController(this));
        }
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

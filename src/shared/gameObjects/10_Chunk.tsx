import { Scene, Vector2 } from 'babylonjs';
import { AbstractGameObject } from './00_AbstractGameObject';
import { GameScene } from '../Scene';
import { AbstractGameEntity } from './20_AbstractGameEntity';
import { ChunkRenderer } from './renderers/60_ChunkRenderer';

export type tileType = number;

export interface serializedChunk {
    x: number;
    y: number;
    ground: tileType[][];
}

export class Chunk extends AbstractGameObject {
    public ground: tileType[][] = [[]];
    public entities: Set<AbstractGameEntity> = new Set();

    constructor(public gameScene: GameScene, x: number, y: number) {
        super(gameScene);
        this.position = new Vector2(x, y);
    }

    get id(): string {
        return Chunk.getId(this.position.x, this.position.y);
    }

    serialize(): serializedChunk {
        return {
            x: this.position.x,
            y: this.position.y,
            ground: this.ground,
        };
    }

    deserialize(serialized: serializedChunk): void {
        this.position.x = serialized.x;
        this.position.y = serialized.y;
        this.ground = serialized.ground;

        this.update();
    }

    static getId(x: number, y: number): string {
        return x.toString() + 'x' + y.toString();
    }

    hasEntity(entity: AbstractGameEntity) {
        return (
            entity.position.x > this.position.x * 16 - 8 &&
            entity.position.x < this.position.x * 16 + 8 &&
            entity.position.y > this.position.y * 16 - 8 &&
            entity.position.y < this.position.y * 16 + 8
        );
    }

    public updateEntity(entity: AbstractGameEntity) {
        if (this.hasEntity(entity)) {
            if (!this.entities.has(entity)) {
                this.entities.add(entity);
            }
        } else {
            if (this.entities.has(entity)) {
                this.entities.delete(entity);
            }
        }
    }

    async attachRenderer(scene: Scene) {
        super.attachRenderer(scene);

        this.renderer = new ChunkRenderer(this, scene);
    }
}

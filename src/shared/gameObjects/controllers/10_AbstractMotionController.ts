import { AbstractGameEntity } from '../01_AbstractGameEntity';
import { AbstractController } from './00_AbstractController';

export interface keyBindings {
    up: number;
    down: number;
    left: number;
    right: number;
}

const SLOWING = 0.95;
const MODIFIER = 0.1;

export abstract class AbstractMotionController extends AbstractController {
    public velocityX: number = 0;
    public velocityY: number = 0;

    constructor(protected object: AbstractGameEntity) {
        super(object);
    }

    tick(deltaTime: number) {
        const deltaTimeModified = MODIFIER * deltaTime;

        const ogX = this.object.position.x;
        const ogY = this.object.position.y;

        this.object.position.x += this.velocityX * deltaTimeModified;
        this.object.position.y += this.velocityY * deltaTimeModified;

        this.velocityX *= Math.pow(SLOWING, deltaTimeModified);
        this.velocityY *= Math.pow(SLOWING, deltaTimeModified);

        if (Math.abs(this.velocityX) < 0.001) {
            this.velocityX = 0;
        }
        if (Math.abs(this.velocityY) < 0.001) {
            this.velocityY = 0;
        }

        // Colisions
        const colisions = this.object.gameScene.getColisions(this.object);
        if (colisions.length() > 0) {
            let colisionX = false;
            let colisionY = false;

            colisions.forEach((entity) => {
                let colisionFromBottom =
                    !(ogY - this.object.hitbox.height < entity.position.y + entity.hitbox.height) &&
                    this.object.position.y - this.object.hitbox.height < entity.position.y + entity.hitbox.height;

                let colisionFromLeft =
                    !(ogX + this.object.hitbox.width > entity.position.x - entity.hitbox.width) &&
                    this.object.position.x + this.object.hitbox.width > entity.position.x - entity.hitbox.width;

                let colisionFromTop =
                    !(ogY + this.object.hitbox.height > entity.position.y - entity.hitbox.height) &&
                    this.object.position.y + this.object.hitbox.height > entity.position.y - entity.hitbox.height;

                let colisionFromRight =
                    !(ogX - this.object.hitbox.width < entity.position.x + entity.hitbox.width) &&
                    this.object.position.x - this.object.hitbox.width < entity.position.x + entity.hitbox.width;

                colisionX = colisionX || colisionFromLeft || colisionFromRight;
                colisionY = colisionY || colisionFromBottom || colisionFromTop;
            });

            if (colisionX) {
                this.object.position.x = ogX;
                this.velocityX = 0;
            }
            if (colisionY) {
                this.object.position.y = ogY;
                this.velocityY = 0;
            }
        }
    }

    public immediately(x: number, y: number, velocityX: number, velocityY: number) {
        this.object.position.x = x;
        this.object.position.y = y;
        this.velocityX = velocityX;
        this.velocityY = velocityY;
    }
}

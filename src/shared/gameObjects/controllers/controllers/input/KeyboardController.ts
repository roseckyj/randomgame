import { AbstractGameEntity } from '../../../20_AbstractGameEntity';
import { AbstractInputController } from './AbstractInputController';

export interface keyBindings {
    up: number;
    down: number;
    left: number;
    right: number;
}

const SPEED_CHANGE = 0.002;
const SLOWING = 0.95;
const MODIFIER = 0.1;

export class KeyboardMotionController extends AbstractInputController {
    private keyBindings: keyBindings = {
        up: 0,
        down: 0,
        left: 0,
        right: 0,
    };

    constructor(protected object: AbstractGameEntity) {
        super(object);
    }

    tick(deltaTime: number) {
        const deltaTimeModified = MODIFIER * deltaTime;

        let movingX = false;
        let movingY = false;

        const diagonalModifier = Math.sqrt(2);

        if (this.keysPressed.includes(this.keyBindings.left) || this.keysPressed.includes(this.keyBindings.right)) {
            movingX = true;
        }
        if (this.keysPressed.includes(this.keyBindings.up) || this.keysPressed.includes(this.keyBindings.down)) {
            movingY = true;
        }

        if (this.keysPressed.includes(this.keyBindings.left)) {
            // Left
            this.object.velocity.x -= (SPEED_CHANGE * deltaTimeModified) / (movingY ? diagonalModifier : 1);
        }
        if (this.keysPressed.includes(this.keyBindings.right)) {
            // Right
            this.object.velocity.x += (SPEED_CHANGE * deltaTimeModified) / (movingY ? diagonalModifier : 1);
        }
        if (this.keysPressed.includes(this.keyBindings.up)) {
            // Up
            this.object.velocity.y -= (SPEED_CHANGE * deltaTimeModified) / (movingX ? diagonalModifier : 1);
        }
        if (this.keysPressed.includes(this.keyBindings.down)) {
            // Down
            this.object.velocity.y += (SPEED_CHANGE * deltaTimeModified) / (movingX ? diagonalModifier : 1);
        }

        const ogX = this.object.position.x;
        const ogY = this.object.position.y;

        this.object.position.x += this.object.velocity.x * deltaTimeModified;
        this.object.position.y += this.object.velocity.y * deltaTimeModified;

        this.object.velocity.x *= Math.pow(SLOWING, deltaTimeModified);
        this.object.velocity.y *= Math.pow(SLOWING, deltaTimeModified);

        if (Math.abs(this.object.velocity.x) < 0.001) {
            this.object.velocity.x = 0;
        }
        if (Math.abs(this.object.velocity.y) < 0.001) {
            this.object.velocity.y = 0;
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
                this.object.velocity.x = 0;
            }
            if (colisionY) {
                this.object.position.y = ogY;
                this.object.velocity.y = 0;
            }
        }
    }

    public bindKeys(newBindings: Partial<keyBindings>) {
        this.keyBindings = { ...this.keyBindings, ...newBindings };
    }
}

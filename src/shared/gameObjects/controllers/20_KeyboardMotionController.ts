import { AbstractMotionController } from './10_AbstractMotionController';

export interface keyBindings {
    up: number;
    down: number;
    left: number;
    right: number;
}

const SPEED_CHANGE = 0.002;
const MODIFIER = 0.1;

export class KeyboardMotionController extends AbstractMotionController {
    private keyBindings: keyBindings = {
        up: 0,
        down: 0,
        left: 0,
        right: 0,
    };

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
            this.velocityX -= (SPEED_CHANGE * deltaTimeModified) / (movingY ? diagonalModifier : 1);
        }
        if (this.keysPressed.includes(this.keyBindings.right)) {
            // Right
            this.velocityX += (SPEED_CHANGE * deltaTimeModified) / (movingY ? diagonalModifier : 1);
        }
        if (this.keysPressed.includes(this.keyBindings.up)) {
            // Up
            this.velocityY -= (SPEED_CHANGE * deltaTimeModified) / (movingX ? diagonalModifier : 1);
        }
        if (this.keysPressed.includes(this.keyBindings.down)) {
            // Down
            this.velocityY += (SPEED_CHANGE * deltaTimeModified) / (movingX ? diagonalModifier : 1);
        }

        super.tick(deltaTime);
    }

    public bindKeys(newBindings: Partial<keyBindings>) {
        this.keyBindings = { ...this.keyBindings, ...newBindings };
    }
}

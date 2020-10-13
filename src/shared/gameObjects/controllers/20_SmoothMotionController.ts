import { AbstractMotionController } from './10_AbstractMotionController';

const SMOOTH_TIME = 50;

export class SmoothMotionController extends AbstractMotionController {
    private targetX: number = 0;
    private targetY: number = 0;
    private finalVelocityX: number = 0;
    private finalVelocityY: number = 0;
    private targetTime: number = -1;

    tick(deltaTime: number) {
        if (this.targetTime > 0) {
            this.object.position.x += this.velocityX * deltaTime;
            this.object.position.y += this.velocityY * deltaTime;
            this.targetTime -= deltaTime;

            if (this.targetTime <= 0) {
                this.object.position.x = this.targetX;
                this.object.position.y = this.targetY;
                this.velocityX = this.finalVelocityX;
                this.velocityY = this.finalVelocityY;
            }
            return;
        } else {
            super.tick(deltaTime);
        }
    }

    public ease(x: number, y: number, velocityX: number, velocityY: number) {
        this.targetX = x;
        this.targetY = y;

        this.finalVelocityX = velocityX;
        this.finalVelocityY = velocityY;
        this.targetTime = SMOOTH_TIME;
        this.velocityX = (x - this.object.position.x) / SMOOTH_TIME;
        this.velocityY = (y - this.object.position.y) / SMOOTH_TIME;
    }

    public immediately(x: number, y: number, velocityX: number, velocityY: number) {
        this.targetTime = -1;
        super.immediately(x, y, velocityX, velocityY);
    }
}

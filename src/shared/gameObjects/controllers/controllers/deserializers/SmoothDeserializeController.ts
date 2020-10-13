import { AbstractGameEntity, serializedEntity } from '../../../20_AbstractGameEntity';
import { AbstractController } from '../AbstractController';

const SMOOTH_TIME_DEFAULT = 110;

export class SmoothDeserializeController extends AbstractController {
    private targetX: number = 0;
    private targetY: number = 0;
    private finalVelocityX: number = 0;
    private finalVelocityY: number = 0;
    private targetTime: number = -1;

    private smoothTime: number = SMOOTH_TIME_DEFAULT;

    constructor(protected object: AbstractGameEntity) {
        super(object);
    }

    public tick(deltaTime: number) {
        if (this.targetTime > 0) {
            this.object.position.x += this.object.velocity.x * deltaTime;
            this.object.position.y += this.object.velocity.y * deltaTime;
            this.targetTime -= deltaTime;

            if (this.targetTime <= 0) {
                this.object.position.x = this.targetX;
                this.object.position.y = this.targetY;
                this.object.velocity.x = this.finalVelocityX;
                this.object.velocity.y = this.finalVelocityY;
            }
            return;
        } else {
            super.tick(deltaTime);
        }
    }

    public setSmoothTime(time: number) {
        this.smoothTime = time;
    }

    public deserialize(serialized: serializedEntity<any>) {
        this.targetX = serialized.x;
        this.targetY = serialized.y;

        this.finalVelocityX = serialized.velocityX;
        this.finalVelocityY = serialized.velocityY;
        this.targetTime = this.smoothTime;
        this.object.velocity.x = (serialized.x - this.object.position.x) / this.smoothTime;
        this.object.velocity.y = (serialized.y - this.object.position.y) / this.smoothTime;
    }
}

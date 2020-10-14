import { Chicken } from '../../../60_Chicken';
import { Player } from '../../../60_Player';
import { AbstractController } from '../AbstractController';

const ROTATION_SPEED = 0.03;
const SPEED = 0.001;
const SPEED2 = 0.0035;

export class ChickenAIController extends AbstractController {
    angle: number = 0;

    constructor(protected object: Chicken) {
        super(object);
    }

    public tick(deltaTime: number) {
        const closestPlayer = this.object.gameScene.getClosestEntityOfType(this.object, Player);
        if (closestPlayer && closestPlayer.distance < 2) {
            this.object.inLove = closestPlayer.entity.id;
        }
        if (closestPlayer && closestPlayer.distance < 10) {
            let rotate = 0;
            if (this.object.inLove !== closestPlayer.entity.id) {
                rotate = Math.PI;
            }

            this.angle =
                Math.atan2(
                    closestPlayer.entity.position.y - this.object.position.y,
                    closestPlayer.entity.position.x - this.object.position.x,
                ) + rotate;

            this.object.velocity.x = Math.cos(this.angle) * SPEED2 * deltaTime;
            this.object.velocity.y = Math.sin(this.angle) * SPEED2 * deltaTime;
        } else {
            this.angle += (Math.random() - 0.5) * 2 * ROTATION_SPEED * deltaTime;

            this.object.velocity.x = Math.cos(this.angle) * SPEED * deltaTime;
            this.object.velocity.y = Math.sin(this.angle) * SPEED * deltaTime;
        }

        const ogX = this.object.position.x;
        const ogY = this.object.position.y;

        this.object.position.x += this.object.velocity.x;
        this.object.position.y += this.object.velocity.y;

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

        this.object.setDirty();

        // TODO: Collisions
    }
}

import { AbstractGameEntity, serializedEntity } from '../../../20_AbstractGameEntity';
import { AbstractController } from '../AbstractController';

export class ImmediateDeserializeController extends AbstractController {
    constructor(protected object: AbstractGameEntity) {
        super(object);
    }

    public deserialize(serialized: serializedEntity<any>) {
        this.object.position.x = serialized.x;
        this.object.position.y = serialized.y;
        this.object.velocity.x = serialized.velocityX;
        this.object.velocity.y = serialized.velocityY;
    }
}

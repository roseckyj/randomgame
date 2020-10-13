import { AbstractGameObject } from '../../00_AbstractGameObject';
import { serializedEntity } from '../../20_AbstractGameEntity';

export abstract class AbstractController {
    constructor(protected object: AbstractGameObject) {}

    public tick(deltaTime: number) {}
    public deserialize(serialized: serializedEntity<any>) {}
}

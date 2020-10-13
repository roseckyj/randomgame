import { Scene } from 'babylonjs/scene';
import { CAMERA_ANGLE } from '../../constants';
import { AbstractGameEntity } from '../20_AbstractGameEntity';
import { AbstractRenderer } from './00_AbstractRenderer';

export abstract class AbstractEntityRenderer extends AbstractRenderer {
    constructor(protected object: AbstractGameEntity, protected babylonScene: Scene) {
        super(object, babylonScene);
    }

    async update() {
        if (this.mesh) {
            this.mesh.position.z = -(this.object.getSize().y * Math.cos(CAMERA_ANGLE)) / 2;
            this.mesh.rotation.x = -CAMERA_ANGLE;

            this.mesh.position.x = this.object.position.x * 100;
            this.mesh.position.y =
                -this.object.position.y * 100 + (this.object.getSize().y * Math.sin(CAMERA_ANGLE)) / 2;

            this.mesh.isPickable = true;
        }
    }
}

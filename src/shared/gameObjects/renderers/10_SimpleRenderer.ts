import { Mesh, MeshBuilder } from 'babylonjs';
import { Scene } from 'babylonjs/scene';
import { getSimpleMaterial } from './textures/textureEngine';
import { AbstractGameEntity } from '../20_AbstractGameEntity';
import { AbstractEntityRenderer } from './01_AbstractEntityRenderer';

/**
 * Renders entity with single static material.
 */
export class SimpleRenderer extends AbstractEntityRenderer {
    constructor(protected object: AbstractGameEntity, protected babylonScene: Scene, private material: string) {
        super(object, babylonScene);

        const size = object.getSize();

        this.mesh = MeshBuilder.CreatePlane(
            object.id,
            { width: size.x, height: size.y, sideOrientation: Mesh.FRONTSIDE },
            this.babylonScene,
        );
        this.mesh.material = getSimpleMaterial(material, this.babylonScene);

        this.update();
    }
}

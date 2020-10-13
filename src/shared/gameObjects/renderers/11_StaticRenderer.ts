import { Mesh, MeshBuilder } from 'babylonjs';
import { Scene } from 'babylonjs/scene';
import { getSimpleMaterial } from '../../../frontend/gameMechanics/textures/textureEngine';
import { AbstractGameEntity } from '../20_AbstractGameEntity';
import { AbstractEntityRenderer } from './01_AbstractEntityRenderer';

/**
 * Renders entity with interchangeable static materials.
 *
 * Material is updated on every `update()` call and is obtained calling `getMaterial` function
 */
export class StaticRenderer extends AbstractEntityRenderer {
    constructor(
        protected object: AbstractGameEntity,
        protected babylonScene: Scene,
        private getMaterial: () => string,
    ) {
        super(object, babylonScene);

        const size = object.getSize();

        this.mesh = MeshBuilder.CreatePlane(
            object.id,
            { width: size.x, height: size.y, sideOrientation: Mesh.FRONTSIDE },
            this.babylonScene,
        );
        this.update();
    }

    async update() {
        super.update();
        this.mesh.material = getSimpleMaterial(this.getMaterial(), this.babylonScene);
    }
}

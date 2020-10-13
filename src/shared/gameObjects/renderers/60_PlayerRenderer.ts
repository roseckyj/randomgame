import { DynamicTexture, Mesh, MeshBuilder, Texture, Vector3 } from 'babylonjs';
import { Scene } from 'babylonjs/scene';
import { AnimatedTexture } from '../../../frontend/gameMechanics/textures/AnimatedTexture';
import { createMaterial } from '../../../frontend/gameMechanics/textures/textureEngine';
import { Player } from '../60_Player';
import { AbstractEntityRenderer } from './01_AbstractEntityRenderer';

export class PlayerRenderer extends AbstractEntityRenderer {
    private texture: AnimatedTexture;
    private titleTexture: DynamicTexture;

    constructor(protected object: Player, protected babylonScene: Scene) {
        super(object, babylonScene);

        if (!this.babylonScene) return;

        const size = object.getSize();

        this.mesh = MeshBuilder.CreatePlane(
            object.id,
            { width: size.x, height: size.y, sideOrientation: Mesh.FRONTSIDE },
            this.babylonScene,
        );
        this.texture = new AnimatedTexture('player', this.babylonScene, 'default');
        this.mesh.material = createMaterial(this.texture.getTexture(), this.babylonScene);

        // Player title
        const title = MeshBuilder.CreatePlane(
            'title ' + object.id,
            { width: 200, height: 40, sideOrientation: Mesh.FRONTSIDE },
            this.babylonScene,
        );
        title.position = new Vector3(0, 110, -3);
        const titleTexture = new DynamicTexture(
            'titleTexture ' + object.id,
            { width: 200, height: 40 },
            this.babylonScene,
            true,
            Texture.LINEAR_LINEAR,
        );
        this.titleTexture = titleTexture;

        title.parent = this.mesh;
        title.material = createMaterial(titleTexture, this.babylonScene);

        this.update();
    }

    async update() {
        super.update();

        const ctx = this.titleTexture.getContext();
        ctx.clearRect(0, 0, this.titleTexture.getSize().width, this.titleTexture.getSize().height);
        ctx.fillStyle = '#343434AA';
        ctx.fillRect(0, 0, this.titleTexture.getSize().width, this.titleTexture.getSize().height);

        ctx.font = '32px pixel';
        ctx.textBaseline = 'middle';
        ctx.textAlign = 'center';
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText(this.object.name, this.titleTexture.getSize().width / 2, this.titleTexture.getSize().height / 2);
        this.titleTexture.update();

        const WALKING_THRESHOLD = 0.01;
        if (
            Math.abs(this.object.velocity.x) > WALKING_THRESHOLD ||
            Math.abs(this.object.velocity.x) > WALKING_THRESHOLD
        ) {
            this.texture.queueOnce('walking');
        } else {
            this.texture.queueOnce('default');
        }
    }

    detach() {
        if (this.babylonScene && this.mesh) {
            const child = this.mesh.getChildMeshes()[0];

            if (this.titleTexture && child && child.material) {
                this.babylonScene.removeTexture(this.titleTexture);
                this.babylonScene.removeMaterial(child.material);
            }
        }

        // Mesh detached by super
        super.detach();
    }
}

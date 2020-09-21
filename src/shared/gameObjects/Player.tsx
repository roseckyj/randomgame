import { Vector3, Mesh, Scene, MeshBuilder, DynamicTexture, Texture } from 'babylonjs';
import { createMaterial } from '../../frontend/gameMechanics/textures/textureEngine';
import { AnimatedTexture } from '../../frontend/gameMechanics/textures/AnimatedTexture';
import { GameScene } from './Scene';
import { AbstractGameEntity, serializedEntity } from './01_AbstractGameEntity';

export interface serializedPlayer {
    velocityX: number;
    velocityY: number;
}

export interface keyBindings {
    up: number;
    down: number;
    left: number;
    right: number;
}

const SPEED_CHANGE = 0.2;
const SLOWING = 0.95;
const MODIFIER = 0.1;
const SMOOTH_TIME = 50;

export class Player extends AbstractGameEntity {
    private velocityX: number = 0;
    private velocityY: number = 0;

    // SMOOTHING
    private targetX: number = 0;
    private targetY: number = 0;
    private finalVelocityX: number = 0;
    private finalVelocityY: number = 0;
    private targetTime: number = -1;

    private keyBindings: keyBindings = {
        up: 0,
        down: 0,
        left: 0,
        right: 0,
    };
    private keysPressed: number[] = [];

    private texture: AnimatedTexture;
    private titleTexture: DynamicTexture;

    constructor(gameScene: GameScene, public id: string) {
        super(gameScene);
    }

    serialize(): serializedEntity<serializedPlayer> {
        let sup = super.serialize() as serializedEntity<serializedPlayer>;
        sup.type = Player.type;
        sup.data = {
            velocityX: this.velocityX,
            velocityY: this.velocityY,
        };
        return sup;
    }

    deserialize(serialized: serializedEntity<serializedPlayer>, dirty: boolean, smooth?: boolean): void {
        if (smooth) {
            this.targetX = serialized.x;
            this.targetY = serialized.y;
            this.finalVelocityX = serialized.data.velocityX;
            this.finalVelocityY = serialized.data.velocityY;
            this.targetTime = SMOOTH_TIME;
            this.velocityX = (serialized.x - this.position.x) / SMOOTH_TIME;
            this.velocityY = (serialized.y - this.position.y) / SMOOTH_TIME;
        } else {
            this.position.x = serialized.x;
            this.position.y = serialized.y;
            this.velocityX = serialized.data.velocityX;
            this.velocityY = serialized.data.velocityY;
        }
        super.deserialize(serialized, dirty, smooth);
    }

    tick(deltaTime: number) {
        if (this.targetTime > 0) {
            this.position.x += this.velocityX * deltaTime;
            this.position.y += this.velocityY * deltaTime;
            this.targetTime -= deltaTime;

            if (this.targetTime <= 0) {
                this.position.x = this.targetX;
                this.position.y = this.targetY;
                this.velocityX = this.finalVelocityX;
                this.velocityY = this.finalVelocityY;
            }

            this.updateMesh();
            return;
        }

        if (!this.keyBindings.up && !this.keyBindings.down && !this.keyBindings.left && !this.keyBindings.right) {
            this.position.x += this.velocityX;
            this.position.y += this.velocityY;

            this.updateMesh();
            return;
        }

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

        const ogX = this.position.x;
        const ogY = this.position.y;

        this.position.x += this.velocityX * deltaTimeModified;
        this.position.y += this.velocityY * deltaTimeModified;

        this.velocityX *= Math.pow(SLOWING, deltaTimeModified);
        this.velocityY *= Math.pow(SLOWING, deltaTimeModified);

        if (Math.abs(this.velocityX) < 0.1) {
            this.velocityX = 0;
        }
        if (Math.abs(this.velocityY) < 0.1) {
            this.velocityY = 0;
        }

        if (ogX !== this.position.x || ogY !== this.position.y) {
            // Should check speed also, but f*ck it
            this.dirty = true;
        }
        this.updateMesh();
    }

    // ========== CONTROLS ===========

    keyDown(keyCode: number) {
        if (!this.keysPressed.includes(keyCode)) {
            this.keysPressed.push(keyCode);
        }
    }

    keyUp(keyCode: number) {
        if (this.keysPressed.includes(keyCode)) {
            this.keysPressed = this.keysPressed.filter((key) => key !== keyCode);
        }
    }

    bindKeys(newBindings: Partial<keyBindings>) {
        this.keyBindings = { ...this.keyBindings, ...newBindings };
    }

    // ========== BABYLON ===========

    attachBabylon(scene: Scene) {
        super.attachBabylon(scene);

        if (!this.babylonScene) return this;

        this.mesh = MeshBuilder.CreatePlane(
            'player',
            { width: 100, height: 200, sideOrientation: Mesh.FRONTSIDE },
            this.babylonScene,
        );
        this.texture = new AnimatedTexture('player', this.babylonScene, 'default');
        this.mesh.material = createMaterial(this.texture.getTexture(), this.babylonScene);

        // Player title
        const title = MeshBuilder.CreatePlane(
            'title',
            { width: 200, height: 40, sideOrientation: Mesh.FRONTSIDE },
            this.babylonScene,
        );
        title.position = new Vector3(0, 110, -3);
        const titleTexture = new DynamicTexture(
            'titleTexture',
            { width: 200, height: 40 },
            this.babylonScene,
            true,
            Texture.LINEAR_LINEAR,
        );
        this.titleTexture = titleTexture;
        const ctx = titleTexture.getContext();
        ctx.fillStyle = '#343434AA';
        ctx.fillRect(0, 0, titleTexture.getSize().width, titleTexture.getSize().height);
        ctx.font = '32px pixel';
        ctx.textBaseline = 'middle';
        ctx.textAlign = 'center';
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText(this.id, titleTexture.getSize().width / 2, titleTexture.getSize().height / 2);
        titleTexture.update();

        title.parent = this.mesh;
        title.material = createMaterial(titleTexture, this.babylonScene);

        this.updateMesh();

        return this;
    }

    async updateMesh() {
        if (!this.mesh) return;
        this.mesh.position = new Vector3(this.position.x, -this.position.y, -1);

        const WALKING_THRESHOLD = 1;
        if (Math.abs(this.velocityX) > WALKING_THRESHOLD || Math.abs(this.velocityY) > WALKING_THRESHOLD) {
            this.texture.queueOnce('walking');
        } else {
            this.texture.queueOnce('default');
        }
    }

    detachBabylon() {
        this.texture.detach();
        if (this.babylonScene && this.mesh) {
            const child = this.mesh.getChildMeshes()[0];

            if (this.mesh.material) {
                this.babylonScene.removeMaterial(this.mesh.material);
            }
            if (this.titleTexture && child && child.material) {
                this.babylonScene.removeTexture(this.titleTexture);
                this.babylonScene.removeMaterial(child.material);
            }
        }

        // Mesh detached by super
        return super.detachBabylon();
    }

    static get type() {
        return 'player';
    }
}

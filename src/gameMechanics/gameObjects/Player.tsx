import { Vector3, Mesh, Scene, MeshBuilder, DynamicTexture, Texture } from '@babylonjs/core';
import { createTexture, createMaterial } from '../textures/textureEngine';
import { AbstractGameObject } from './AbstractGameObject';

export interface serializedPlayer {
    x: number;
    y: number;
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

export class Player extends AbstractGameObject {
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

    constructor(public id: string) {
        super();
    }

    serialize(): serializedPlayer {
        return {
            x: this.position.x,
            y: this.position.y,
            velocityX: this.velocityX,
            velocityY: this.velocityY,
        };
    }

    deserialize(serialized: serializedPlayer, smooth?: boolean): void {
        if (smooth) {
            this.targetX = serialized.x;
            this.targetY = serialized.y;
            this.finalVelocityX = serialized.velocityX;
            this.finalVelocityY = serialized.velocityY;
            this.targetTime = SMOOTH_TIME;
            this.velocityX = (serialized.x - this.position.x) / SMOOTH_TIME;
            this.velocityY = (serialized.y - this.position.y) / SMOOTH_TIME;
        } else {
            this.position.x = serialized.x;
            this.position.y = serialized.y;
            this.velocityX = serialized.velocityX;
            this.velocityY = serialized.velocityY;
        }
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

        if (!this.scene) return this;

        this.mesh = MeshBuilder.CreatePlane(
            'player',
            { width: 60, height: 100, sideOrientation: Mesh.FRONTSIDE },
            this.scene,
        );
        const texture = createTexture('player', this.scene);
        this.mesh.material = createMaterial(texture, this.scene);

        // Player title
        const title = MeshBuilder.CreatePlane(
            'title',
            { width: 100, height: 20, sideOrientation: Mesh.FRONTSIDE },
            this.scene,
        );
        title.position = new Vector3(0, 60, -3);
        const titleTexture = new DynamicTexture(
            'titleTexture',
            { width: 100, height: 20 },
            this.scene,
            true,
            Texture.NEAREST_LINEAR,
        );
        const ctx = titleTexture.getContext();
        ctx.fillStyle = '#000000AA';
        ctx.fillRect(0, 0, titleTexture.getSize().width, titleTexture.getSize().height);
        ctx.font = '15px Arial';
        ctx.textBaseline = 'middle';
        ctx.textAlign = 'center';
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText(
            this.id,
            titleTexture.getSize().width / 2,
            titleTexture.getSize().height / 2,
            titleTexture.getSize().width - 20,
        );
        titleTexture.update();

        title.parent = this.mesh;
        title.material = createMaterial(titleTexture, this.scene);

        this.updateMesh();

        return this;
    }

    async updateMesh() {
        if (this.mesh) this.mesh.position = new Vector3(this.position.x, -this.position.y, -1);
    }
}

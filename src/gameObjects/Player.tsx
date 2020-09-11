import { Vector3, Mesh, Color3, Scene, MeshBuilder, StandardMaterial, DynamicTexture, Texture } from '@babylonjs/core';
import { IMAGES } from '../utils/textures';

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

export class Player {
    public x: number = 0;
    public y: number = 0;
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

    private mesh: Mesh;

    constructor(private scene: Scene, public id: string) {
        this.mesh = MeshBuilder.CreatePlane(
            'chunk',
            { width: 50, height: 50, sideOrientation: Mesh.BACKSIDE },
            this.scene,
        );
        this.mesh.rotation = new Vector3(0, 0, Math.PI);

        const texture = new DynamicTexture(
            'chunkTexture',
            { width: 16, height: 16 },
            this.scene,
            true,
            Texture.NEAREST_NEAREST,
        );

        const ctx = texture.getContext();
        ctx.drawImage(IMAGES.player, 0, 0, 16, 16);
        texture.update();

        const material = new StandardMaterial('mat', this.scene);
        material.diffuseTexture = texture;
        this.mesh.material = material;
    }

    serialize(): serializedPlayer {
        return {
            x: this.x,
            y: this.y,
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
            this.velocityX = (serialized.x - this.x) / SMOOTH_TIME;
            this.velocityY = (serialized.y - this.y) / SMOOTH_TIME;
        } else {
            this.x = serialized.x;
            this.y = serialized.y;
            this.velocityX = serialized.velocityX;
            this.velocityY = serialized.velocityY;
        }
    }

    bindKeys(newBindings: Partial<keyBindings>) {
        this.keyBindings = { ...this.keyBindings, ...newBindings };
    }

    tick(deltaTime: number) {
        if (this.targetTime > 0) {
            this.x += this.velocityX * deltaTime;
            this.y += this.velocityY * deltaTime;
            this.targetTime -= deltaTime;

            if (this.targetTime <= 0) {
                this.x = this.targetX;
                this.y = this.targetY;
                this.velocityX = this.finalVelocityX;
                this.velocityY = this.finalVelocityY;
            }
            // Update mesh
            this.mesh.position = new Vector3(this.x, this.y, 0);
            return;
        }

        if (!this.keyBindings.up && !this.keyBindings.down && !this.keyBindings.left && !this.keyBindings.right) {
            this.x += this.velocityX;
            this.y += this.velocityY;
            // Update mesh
            this.mesh.position = new Vector3(this.x, this.y, 0);
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

        this.x += this.velocityX * deltaTimeModified;
        this.y += this.velocityY * deltaTimeModified;

        this.velocityX *= Math.pow(SLOWING, deltaTimeModified);
        this.velocityY *= Math.pow(SLOWING, deltaTimeModified);

        if (Math.abs(this.velocityX) < 0.1) {
            this.velocityX = 0;
        }
        if (Math.abs(this.velocityY) < 0.1) {
            this.velocityY = 0;
        }

        // Update mesh
        this.mesh.position = new Vector3(this.x, this.y, 0);
    }

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

    setVisibility(visible: boolean) {
        this.mesh.setEnabled(visible);
    }
}

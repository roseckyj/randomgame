import { Vector3, Mesh, Scene, MeshBuilder, DynamicTexture, Texture, Vector2 } from 'babylonjs';
import { createMaterial } from '../../frontend/gameMechanics/textures/textureEngine';
import { AnimatedTexture } from '../../frontend/gameMechanics/textures/AnimatedTexture';
import { GameScene } from '../Scene';
import { AbstractGameEntity, serializedEntity } from './01_AbstractGameEntity';

export interface serializedPlayer {
    velocityX: number;
    velocityY: number;
    name: string;
}

export interface keyBindings {
    up: number;
    down: number;
    left: number;
    right: number;
}

const SPEED_CHANGE = 0.002;
const SLOWING = 0.95;
const MODIFIER = 0.1;
const SMOOTH_TIME = 50;

export class Player extends AbstractGameEntity {
    public hitbox = { width: 0.5, height: 0.2 };

    private velocityX: number = 0;
    private velocityY: number = 0;

    public name = '';

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
            name: this.name,
        };
        return sup;
    }

    deserialize(serialized: serializedEntity<serializedPlayer>, smooth?: boolean): void {
        this.position.x = serialized.x;
        this.position.y = serialized.y;
        this.name = serialized.data.name;

        if (smooth) {
            this.finalVelocityX = serialized.data.velocityX;
            this.finalVelocityY = serialized.data.velocityY;
            this.targetTime = SMOOTH_TIME;
            this.velocityX = (serialized.x - this.position.x) / SMOOTH_TIME;
            this.velocityY = (serialized.y - this.position.y) / SMOOTH_TIME;
        } else {
            this.velocityX = serialized.data.velocityX;
            this.velocityY = serialized.data.velocityY;
        }
        super.deserialize(serialized, smooth);
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

        if (Math.abs(this.velocityX) < 0.001) {
            this.velocityX = 0;
        }
        if (Math.abs(this.velocityY) < 0.001) {
            this.velocityY = 0;
        }

        // Colisions
        const colisions = this.gameScene.getColisions(this);
        if (colisions.length() > 0) {
            let colisionX = false;
            let colisionY = false;

            colisions.forEach((entity) => {
                let colisionFromBottom =
                    !(ogY - this.hitbox.height < entity.position.y + entity.hitbox.height) &&
                    this.position.y - this.hitbox.height < entity.position.y + entity.hitbox.height;

                let colisionFromLeft =
                    !(ogX + this.hitbox.width > entity.position.x - entity.hitbox.width) &&
                    this.position.x + this.hitbox.width > entity.position.x - entity.hitbox.width;

                let colisionFromTop =
                    !(ogY + this.hitbox.height > entity.position.y - entity.hitbox.height) &&
                    this.position.y + this.hitbox.height > entity.position.y - entity.hitbox.height;

                let colisionFromRight =
                    !(ogX - this.hitbox.width < entity.position.x + entity.hitbox.width) &&
                    this.position.x - this.hitbox.width < entity.position.x + entity.hitbox.width;

                colisionX = colisionX || colisionFromLeft || colisionFromRight;
                colisionY = colisionY || colisionFromBottom || colisionFromTop;
            });

            if (colisionX) {
                this.position.x = ogX;
                this.velocityX = 0;
            }
            if (colisionY) {
                this.position.y = ogY;
                this.velocityY = 0;
            }
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

    static get type() {
        return 'player';
    }

    // ========== BABYLON ===========

    async attachBabylon(scene: Scene) {
        if (this.babylonScene) return;
        await super.attachBabylon(scene);

        if (!this.babylonScene) return;

        const size = this.getSize();

        this.mesh = MeshBuilder.CreatePlane(
            'player ' + this.id,
            { width: size.x, height: size.y, sideOrientation: Mesh.FRONTSIDE },
            this.babylonScene,
        );
        this.texture = new AnimatedTexture('player', this.babylonScene, 'default');
        this.mesh.material = createMaterial(this.texture.getTexture(), this.babylonScene);

        // Player title
        const title = MeshBuilder.CreatePlane(
            'title ' + this.id,
            { width: 200, height: 40, sideOrientation: Mesh.FRONTSIDE },
            this.babylonScene,
        );
        title.position = new Vector3(0, 110, -3);
        const titleTexture = new DynamicTexture(
            'titleTexture ' + this.id,
            { width: 200, height: 40 },
            this.babylonScene,
            true,
            Texture.LINEAR_LINEAR,
        );
        this.titleTexture = titleTexture;

        title.parent = this.mesh;
        title.material = createMaterial(titleTexture, this.babylonScene);

        this.updateMesh();
    }

    async updateMesh() {
        if (!this.mesh) return;
        super.updateMesh();

        const ctx = this.titleTexture.getContext();
        ctx.clearRect(0, 0, this.titleTexture.getSize().width, this.titleTexture.getSize().height);
        ctx.fillStyle = '#343434AA';
        ctx.fillRect(0, 0, this.titleTexture.getSize().width, this.titleTexture.getSize().height);

        ctx.font = '32px pixel';
        ctx.textBaseline = 'middle';
        ctx.textAlign = 'center';
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText(this.name, this.titleTexture.getSize().width / 2, this.titleTexture.getSize().height / 2);
        this.titleTexture.update();

        const WALKING_THRESHOLD = 0.01;
        if (Math.abs(this.velocityX) > WALKING_THRESHOLD || Math.abs(this.velocityY) > WALKING_THRESHOLD) {
            this.texture.queueOnce('walking');
        } else {
            this.texture.queueOnce('default');
        }
    }

    async detachBabylon() {
        if (this.babylonScene && this.mesh) {
            const child = this.mesh.getChildMeshes()[0];

            if (this.titleTexture && child && child.material) {
                this.babylonScene.removeTexture(this.titleTexture);
                this.babylonScene.removeMaterial(child.material);
            }
        }

        // Mesh detached by super
        super.detachBabylon();
    }

    getSize() {
        return new Vector2(100, 200);
    }
}

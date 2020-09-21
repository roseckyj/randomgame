import { Mesh, Scene, MeshBuilder, StandardMaterial, Texture, DynamicTexture, Vector2 } from 'babylonjs';
import { AbstractGameObject } from './00_AbstractGameObject';
import { GameScene } from './Scene';
import { getImage } from '../../frontend/gameMechanics/textures/textureEngine';

export type tileType = number;

export interface serializedChunk {
    x: number;
    y: number;
    ground: tileType[][];
}

export class Chunk extends AbstractGameObject {
    public ground: tileType[][] = [[]];

    private texture: DynamicTexture;

    constructor(gameScene: GameScene, x: number, y: number) {
        super(gameScene);
        this.position = new Vector2(x, y);
    }

    get id(): string {
        return Chunk.getId(this.position.x, this.position.y);
    }

    serialize(): serializedChunk {
        return {
            x: this.position.x,
            y: this.position.y,
            ground: this.ground,
        };
    }

    deserialize(serialized: serializedChunk): void {
        this.position.x = serialized.x;
        this.position.y = serialized.y;
        this.ground = serialized.ground;

        this.updateMesh();
    }

    static getId(x: number, y: number): string {
        return x.toString() + 'x' + y.toString();
    }

    // ========== BABYLON ===========

    attachBabylon(scene: Scene) {
        super.attachBabylon(scene);

        if (this.babylonScene) {
            this.mesh = MeshBuilder.CreatePlane(
                'chunk',
                { width: 1600, height: 1600, sideOrientation: Mesh.FRONTSIDE },
                this.babylonScene,
            );

            const texture = new DynamicTexture(
                'chunkTexture',
                { width: 16 * 16, height: 16 * 16 },
                this.babylonScene,
                true,
                Texture.NEAREST_NEAREST,
            );

            this.texture = texture;
            const material = new StandardMaterial('mat', this.babylonScene);
            material.emissiveTexture = texture;
            this.mesh.material = material;

            this.updateMesh();
        }

        return this;
    }

    async updateMesh() {
        if (!this.mesh || !this.babylonScene) {
            return;
        }

        this.mesh.position.x = this.position.x * 16 * 100;
        this.mesh.position.y = -this.position.y * 16 * 100;

        const ctx = this.texture.getContext();

        for (let x = 0; x < 16; x++) {
            for (let y = 0; y < 16; y++) {
                if (this.ground[x] && this.ground[x][y]) {
                    ctx.fillStyle = Chunk.getTerrainColor(this.ground[x][y]);

                    ctx.fillRect(x * 16, y * 16, 16, 16);
                    // if ((x + y) % 2 === 0) {
                    //     ctx.fillStyle = '#00000005';
                    //     ctx.fillRect(x * 16, y * 16, 16, 16);
                    // }
                }
            }
        }

        for (let x = 0; x < 16; x++) {
            for (let y = 0; y < 16; y++) {
                if (this.ground[x] && this.ground[x][y]) {
                    if (this.ground[x][y] === 2) {
                        // Water, should have transition

                        this.drawTransition(ctx, x, y, [1, 3], 'grass_water');
                    }

                    /*

                    if (this.ground[x][y] === 3) {
                        // Tree

                        if ((x + y) % 2 === 0) {
                            const shift = Math.floor(Math.random() * 16) - 8;

                            const img = getImage(Math.random() > 0.4 ? "tree_big" : "tree_small");
                            if (img) ctx.drawImage(img, x * 16 + shift, y * 16 + shift);
                        }
                    }

                    */
                }
            }
        }

        this.texture.update();
    }

    drawTransition(ctx: CanvasRenderingContext2D, x: number, y: number, tileType: number[], filePrefix: string) {
        const posX = this.position.x * 16 + x - 8;
        const posY = this.position.y * 16 + y - 8;

        let sides = '';
        if (tileType.includes(this.gameScene.getTile(posX, posY - 1))) sides += 'T';
        if (tileType.includes(this.gameScene.getTile(posX + 1, posY))) sides += 'R';
        if (tileType.includes(this.gameScene.getTile(posX, posY + 1))) sides += 'B';
        if (tileType.includes(this.gameScene.getTile(posX - 1, posY))) sides += 'L';

        if (sides === 'TB') {
            const top = getImage(filePrefix + '_T');
            if (top) ctx.drawImage(top, x * 16, y * 16);
            const bottom = getImage(filePrefix + '_B');
            if (bottom) ctx.drawImage(bottom, x * 16, y * 16);
        } else if (sides === 'RL') {
            const right = getImage(filePrefix + '_R');
            if (right) ctx.drawImage(right, x * 16, y * 16);
            const left = getImage(filePrefix + '_L');
            if (left) ctx.drawImage(left, x * 16, y * 16);
        } else {
            if (sides.length > 0) {
                const img = getImage(filePrefix + '_' + sides);
                if (img) ctx.drawImage(img, x * 16, y * 16);
            }
        }

        const corner = (shiftX: number, shiftY: number, blackList: string[], suffix: string) => {
            if (
                tileType.includes(this.gameScene.getTile(posX + shiftX, posY + shiftY)) &&
                !blackList.reduce((prev, letter) => prev || sides.includes(letter), false)
            ) {
                const img = getImage(filePrefix + '_corner_' + suffix);
                if (img) ctx.drawImage(img, x * 16, y * 16);
            }
        };

        corner(-1, -1, ['L', 'T'], 'BR');
        corner(+1, -1, ['R', 'T'], 'BL');
        corner(-1, +1, ['L', 'B'], 'TR');
        corner(+1, +1, ['R', 'B'], 'TL');
    }

    detachBabylon() {
        if (this.babylonScene && this.mesh && this.texture) {
            this.babylonScene.removeTexture(this.texture);
            if (this.mesh.material) {
                this.babylonScene.removeMaterial(this.mesh.material);
            }
        }

        // Mesh detached by super
        return super.detachBabylon();
    }

    static getTerrainColor(number: number): string {
        switch (number) {
            case 1: // Grass
                return '#67943F';
            case 2: // Water
                return '#2EB0E5';
            case 4: // Sand
                return '#FDDC86';
        }
        return '#DDDDDD';
    }
}

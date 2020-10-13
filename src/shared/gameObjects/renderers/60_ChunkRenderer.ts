import { DynamicTexture, Mesh, MeshBuilder, StandardMaterial, Texture } from 'babylonjs';
import { Scene } from 'babylonjs/scene';
import { getImage } from './textures/textureEngine';
import { getTerrainColor } from '../../colors';
import { Chunk } from '../10_Chunk';
import { AbstractRenderer } from './00_AbstractRenderer';

export class ChunkRenderer extends AbstractRenderer {
    private texture: DynamicTexture;

    constructor(protected object: Chunk, protected babylonScene: Scene) {
        super(object, babylonScene);

        this.mesh = MeshBuilder.CreatePlane(
            'chunk ' + object.id,
            { width: 1600, height: 1600, sideOrientation: Mesh.FRONTSIDE },
            this.babylonScene,
        );

        const texture = new DynamicTexture(
            'chunkTexture ' + object.id,
            { width: 16 * 16, height: 16 * 16 },
            this.babylonScene,
            true,
            Texture.NEAREST_NEAREST,
        );

        this.texture = texture;
        const material = new StandardMaterial('mat ' + object.id, this.babylonScene);
        material.emissiveTexture = texture;
        this.mesh.material = material;

        this.update();
    }

    async update() {
        this.mesh.position.x = this.object.position.x * 16 * 100;
        this.mesh.position.y = -this.object.position.y * 16 * 100;

        const ctx = this.texture.getContext();
        this.drawTexture(ctx);
        this.texture.update();
    }

    detach() {
        if (this.babylonScene && this.mesh && this.texture) {
            this.babylonScene.removeTexture(this.texture);
            if (this.mesh.material) {
                this.babylonScene.removeMaterial(this.mesh.material);
            }
        }

        // Mesh detached by super
        super.detach();
    }

    // Other functions:

    static drawBasicTiling(chunk: Chunk, ctx: CanvasRenderingContext2D, shiftX: number, shiftY: number, size: number) {
        for (let x = 0; x < 16; x++) {
            for (let y = 0; y < 16; y++) {
                if (chunk.ground[x] && chunk.ground[x][y]) {
                    ctx.fillStyle = getTerrainColor(chunk.ground[x][y]);

                    ctx.fillRect(shiftX + x * size, shiftY + y * size, size, size);
                }
            }
        }
    }

    drawTexture(ctx: CanvasRenderingContext2D) {
        ChunkRenderer.drawBasicTiling(this.object, ctx, 0, 0, 16);

        for (let x = 0; x < 16; x++) {
            for (let y = 0; y < 16; y++) {
                if (this.object.ground[x] && this.object.ground[x][y]) {
                    if (this.object.ground[x][y] === 2) {
                        // Water, should have transition
                        this.drawTransition(ctx, x, y, [1, 3], 'grass_water');
                    }
                }
            }
        }
    }

    drawTransition(ctx: CanvasRenderingContext2D, x: number, y: number, tileType: number[], filePrefix: string) {
        const posX = this.object.position.x * 16 + x - 8;
        const posY = this.object.position.y * 16 + y - 8;

        let sides = '';
        if (tileType.includes(this.object.gameScene.getTile(posX, posY - 1))) sides += 'T';
        if (tileType.includes(this.object.gameScene.getTile(posX + 1, posY))) sides += 'R';
        if (tileType.includes(this.object.gameScene.getTile(posX, posY + 1))) sides += 'B';
        if (tileType.includes(this.object.gameScene.getTile(posX - 1, posY))) sides += 'L';

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
                tileType.includes(this.object.gameScene.getTile(posX + shiftX, posY + shiftY)) &&
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
}

import { createCanvas } from 'canvas';
import { Request, Response } from 'express';
import { Player } from '../../../../shared/gameObjects/60_Player';
import { getEntityColor } from '../../../../shared/colors';
import { Chunk } from '../../../../shared/gameObjects/10_Chunk';
import { GameScene } from '../../../../shared/Scene';
import { ChunkRenderer } from '../../../../shared/gameObjects/renderers/60_ChunkRenderer';

function createTile(scene: GameScene, ctx: CanvasRenderingContext2D, x: number, y: number, z: number) {
    const ENTITY_SCALE = 0.5;

    z = Math.pow(2, z - 1);
    const chunksPerTile = 16 / z;

    for (let tX = 0; tX < chunksPerTile; tX++) {
        for (let tY = 0; tY < chunksPerTile; tY++) {
            const chunkX = x * chunksPerTile + tX;
            const chunkY = y * chunksPerTile + tY;
            const chunk = scene.chunks.get(Chunk.getId(chunkX, chunkY));

            if (chunk) {
                ChunkRenderer.drawBasicTiling(chunk, ctx, tX * z * 16, tY * z * 16, z);
                scene.entities
                    .filter((entity) => chunk.hasEntity(entity) && !(entity instanceof Player))
                    .forEach((entity) => {
                        ctx.fillStyle = getEntityColor(entity.serialize().type);
                        ctx.fillRect(
                            (entity.position.x - chunkX * 16 + 8) * z - z * (ENTITY_SCALE / 2) + tX * z * 16,
                            (entity.position.y - chunkY * 16 + 8) * z - z * (ENTITY_SCALE / 2) + tY * z * 16,
                            z * ENTITY_SCALE,
                            z * ENTITY_SCALE,
                        );
                    });
            }

            /*
            ctx.strokeStyle = '#00000030';
            ctx.lineWidth = 1;
            ctx.strokeRect(0, 0, 16 * 16, 16 * 16);
            */
        }
    }
}

export function sendTile(scene: GameScene, req: Request, res: Response) {
    const position = req.params[0]?.split('/');
    if (position.length !== 3) {
        res.sendStatus(400);
        return;
    }
    const z = parseInt(position[0]);
    const x = parseInt(position[1]);
    const y = parseInt(position[2]);

    const canvas = createCanvas(16 * 16, 16 * 16);
    const ctx = canvas.getContext('2d');
    createTile(scene, ctx, x, y, z);

    res.setHeader('Content-Type', 'image/png');
    canvas.createPNGStream().pipe(res);
}

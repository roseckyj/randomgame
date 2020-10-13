import { Request, Response } from 'express';
import { Player } from '../../../../shared/gameObjects/60_Player';
import { GameScene } from '../../../../shared/Scene';

export function sendPlayerData(scene: GameScene, req: Request, res: Response) {
    res.send(
        scene.entities
            .filter((entity) => entity instanceof Player && !entity.disabled)
            .map((entity) => entity.serialize()),
    );
}

import { Chunk } from '../gameObjects/Chunk';
import { AdvancedDynamicTexture } from '@babylonjs/gui/2D/advancedDynamicTexture';
import { GameScene } from '../Scene';
import { Player } from '../gameObjects/Player';

const MINIMAP_DISTANCE = 32;
const MINIMAP_SCALE = 2;
const BORDER_WIDTH = 3;

export function minimap(guiTexture: AdvancedDynamicTexture, gameScene: GameScene, me: Player) {
    const gui = guiTexture.getContext();
    const width = guiTexture.getSize().width;
    //const height = guiTexture.getSize().height;

    const x0 = width - 30 - MINIMAP_SCALE * MINIMAP_DISTANCE;
    const y0 = 20 + MINIMAP_SCALE * MINIMAP_DISTANCE;

    gui.fillStyle = '#000000';
    gui.fillRect(
        x0 - MINIMAP_SCALE * MINIMAP_DISTANCE - BORDER_WIDTH,
        y0 - MINIMAP_SCALE * MINIMAP_DISTANCE - BORDER_WIDTH,
        MINIMAP_SCALE * MINIMAP_DISTANCE * 2 + BORDER_WIDTH * 2 + MINIMAP_SCALE,
        MINIMAP_SCALE * MINIMAP_DISTANCE * 2 + BORDER_WIDTH * 2 + MINIMAP_SCALE,
    );

    for (let x = -MINIMAP_DISTANCE; x <= MINIMAP_DISTANCE; x++) {
        for (let y = -MINIMAP_DISTANCE; y <= MINIMAP_DISTANCE; y++) {
            gui.fillStyle = Chunk.getTerrainColor(gameScene.getTile(me.position.x / 100 + x, me.position.y / 100 + y));
            gui.fillRect(x0 + x * MINIMAP_SCALE, y0 + y * MINIMAP_SCALE, MINIMAP_SCALE, MINIMAP_SCALE);
        }
    }

    gui.fillStyle = '#000000';
    gui.font = '15px Arial';
    gui.textBaseline = 'top';
    gui.textAlign = 'center';
    gui.fillText(
        me ? Math.round(me.position.x / 100) + ' × ' + Math.round(me.position.y / 100) : 'Not connected...',
        x0,
        y0 + MINIMAP_SCALE * MINIMAP_DISTANCE + BORDER_WIDTH + 10,
    );

    gui.fillStyle = '#00000020';
    gui.fillRect(x0 - MINIMAP_SCALE * 3, y0, MINIMAP_SCALE * 7, MINIMAP_SCALE);
    gui.fillRect(x0, y0 - MINIMAP_SCALE * 3, MINIMAP_SCALE, MINIMAP_SCALE * 7);

    guiTexture.update();
}

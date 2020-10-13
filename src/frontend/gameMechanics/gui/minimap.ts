import { AdvancedDynamicTexture } from '@babylonjs/gui/2D/advancedDynamicTexture';
import { GameScene } from '../../../shared/Scene';
import { Player } from '../../../shared/gameObjects/60_Player';
import { shadeText } from '../utils/shadeText';
import { getEntityColor, getTerrainColor } from '../../../shared/colors';

const MINIMAP_DISTANCE = 32;
const MINIMAP_SCALE = 2;
const BORDER_WIDTH = MINIMAP_SCALE + 1;

export function minimap(guiTexture: AdvancedDynamicTexture, gameScene: GameScene, me: Player) {
    const gui = guiTexture.getContext();
    const width = guiTexture.getSize().width;
    //const height = guiTexture.getSize().height;

    const x0 = width - 30 - MINIMAP_SCALE * MINIMAP_DISTANCE;
    const y0 = 20 + MINIMAP_SCALE * MINIMAP_DISTANCE;

    const shiftX = Math.floor((Math.floor(me.position.x) - me.position.x) * MINIMAP_SCALE);
    const shiftY = Math.floor((Math.floor(me.position.y) - me.position.y) * MINIMAP_SCALE);

    gui.fillStyle = '#000000';
    gui.fillRect(
        x0 - MINIMAP_SCALE * MINIMAP_DISTANCE - BORDER_WIDTH,
        y0 - MINIMAP_SCALE * MINIMAP_DISTANCE - BORDER_WIDTH,
        MINIMAP_SCALE * MINIMAP_DISTANCE * 2 + BORDER_WIDTH * 2 + MINIMAP_SCALE,
        MINIMAP_SCALE * MINIMAP_DISTANCE * 2 + BORDER_WIDTH * 2 + MINIMAP_SCALE,
    );

    for (let x = -MINIMAP_DISTANCE; x <= MINIMAP_DISTANCE + 1; x++) {
        for (let y = -MINIMAP_DISTANCE; y <= MINIMAP_DISTANCE + 1; y++) {
            gui.fillStyle = getTerrainColor(gameScene.getTile(me.position.x + x, me.position.y + y));
            gui.fillRect(
                x0 + x * MINIMAP_SCALE + shiftX,
                y0 + y * MINIMAP_SCALE + shiftY,
                MINIMAP_SCALE,
                MINIMAP_SCALE,
            );
        }
    }

    gameScene.entities
        .filter(
            (entity) =>
                Math.abs(entity.position.x - me.position.x) <= MINIMAP_DISTANCE + 1.5 &&
                Math.abs(entity.position.y - me.position.y) <= MINIMAP_DISTANCE + 1.5,
        )
        .forEach((entity) => {
            gui.fillStyle = getEntityColor(entity.serialize().type);
            gui.fillRect(
                Math.floor(x0 + (entity.position.x - me.position.x) * MINIMAP_SCALE),
                Math.floor(y0 + (entity.position.y - me.position.y) * MINIMAP_SCALE),
                MINIMAP_SCALE,
                MINIMAP_SCALE,
            );
        });

    gui.lineWidth = BORDER_WIDTH;
    gui.strokeStyle = '#000000';
    gui.strokeRect(
        x0 - MINIMAP_SCALE * MINIMAP_DISTANCE - BORDER_WIDTH + 2,
        y0 - MINIMAP_SCALE * MINIMAP_DISTANCE - BORDER_WIDTH + 2,
        MINIMAP_SCALE * MINIMAP_DISTANCE * 2 + BORDER_WIDTH * 2 - 4 + MINIMAP_SCALE,
        MINIMAP_SCALE * MINIMAP_DISTANCE * 2 + BORDER_WIDTH * 2 - 4 + MINIMAP_SCALE,
    );

    gui.font = '16px pixel';
    gui.textBaseline = 'top';
    gui.textAlign = 'center';
    shadeText(gui, 'x', x0, y0 + MINIMAP_SCALE * MINIMAP_DISTANCE + BORDER_WIDTH + 10);
    gui.textAlign = 'right';
    shadeText(
        gui,
        Math.round(me.position.x).toString(),
        x0 - 10,
        y0 + MINIMAP_SCALE * MINIMAP_DISTANCE + BORDER_WIDTH + 10,
    );
    gui.textAlign = 'left';
    shadeText(
        gui,
        Math.round(me.position.y).toString(),
        x0 + 10,
        y0 + MINIMAP_SCALE * MINIMAP_DISTANCE + BORDER_WIDTH + 10,
    );

    const time = gameScene.getTime();

    gui.textAlign = 'center';
    shadeText(gui, ':', x0, y0 + MINIMAP_SCALE * MINIMAP_DISTANCE + BORDER_WIDTH + 30);
    gui.textAlign = 'right';
    shadeText(
        gui,
        Math.floor(time.hour).toString(),
        x0 - 10,
        y0 + MINIMAP_SCALE * MINIMAP_DISTANCE + BORDER_WIDTH + 30,
    );
    gui.textAlign = 'left';
    shadeText(
        gui,
        Math.floor(time.min).toString().padStart(2, '0'),
        x0 + 10,
        y0 + MINIMAP_SCALE * MINIMAP_DISTANCE + BORDER_WIDTH + 30,
    );
    gui.textAlign = 'center';
    shadeText(
        gui,
        '(den ' + Math.floor(time.day).toString() + '.)',
        x0,
        y0 + MINIMAP_SCALE * MINIMAP_DISTANCE + BORDER_WIDTH + 50,
    );

    guiTexture.update();
}

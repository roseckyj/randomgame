import { AdvancedDynamicTexture } from '@babylonjs/gui/2D/advancedDynamicTexture';
import { GameScene } from '../../../shared/gameObjects/Scene';

export function debugInfo(guiTexture: AdvancedDynamicTexture, gameScene: GameScene, deltaTime: number) {
    const gui = guiTexture.getContext();

    let x = 30;
    let y = 20;

    const values: { [key: string]: string } = {
        FPS: (1000 / deltaTime).toFixed(2),
        'Enabled entities':
            gameScene.entities.filter((value) => value.getVisibility()).length() +
            ' (of ' +
            gameScene.entities.length() +
            ' loaded)',
        'Enabled chunks':
            gameScene.chunks.filter((value) => value.getVisibility()).length() +
            ' (of ' +
            gameScene.chunks.length() +
            ' loaded)',
    };

    gui.fillStyle = '#FFFFFF';
    gui.font = '15px pixel';
    gui.textBaseline = 'top';
    gui.textAlign = 'left';

    Object.keys(values).forEach((key) => {
        gui.fillText(key + ': ' + values[key], x, y);
        y += 20;
    });

    guiTexture.update();
}

import { AdvancedDynamicTexture } from '@babylonjs/gui/2D/advancedDynamicTexture';
import { GameScene } from '../../../shared/Scene';
import { shadeText } from '../utils/shadeText';

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

    gui.font = '16px pixel';
    gui.textBaseline = 'top';
    gui.textAlign = 'left';

    Object.keys(values).forEach((key) => {
        shadeText(gui, key + ': ' + values[key], x, y);
        y += 20;
    });

    guiTexture.update();
}

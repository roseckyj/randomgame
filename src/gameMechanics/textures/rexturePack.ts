import { Vector2 } from '@babylonjs/core';
import { texturePack } from './textureEngine';

export const textures: texturePack = {
    grass_01: {
        filename: 'HiddenThroughTime/buildings/Atlas_Egypt_Props_01.png',
        corner: new Vector2(365, 1875),
        size: new Vector2(85, 40),
    },
    grass_02: {
        filename: 'HiddenThroughTime/buildings/Atlas_Egypt_Props_01.png',
        corner: new Vector2(365, 1930),
        size: new Vector2(85, 40),
    },
    grass_03: {
        filename: 'HiddenThroughTime/buildings/Atlas_Egypt_Props_01.png',
        corner: new Vector2(365, 1990),
        size: new Vector2(85, 40),
    },
    player: {
        filename: 'HiddenThroughTime/characters/Icon_Peasant_Man_9.png',
        corner: new Vector2(0, 0),
        size: new Vector2(79, 147),
    },
};

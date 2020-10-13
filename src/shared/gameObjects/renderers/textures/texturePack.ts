import { texturePack } from './textureEngine';

export const textures: texturePack = {
    player: {
        filename: 'Character.png',
        width: 57,
        animations: {
            default: {
                start: 0,
                end: 0,
                type: 'frame',
            },
            walking: {
                start: 0,
                end: 7,
                type: 'loop',
            },
            inventory_opening: {
                start: 8,
                end: 11,
                type: 'once',
            },
            inventory_open: {
                start: 11,
                end: 11,
                type: 'frame',
            },
            inventory_closing: {
                start: 11,
                end: 8,
                type: 'once',
            },
            equip: {
                start: 12,
                end: 19,
                type: 'once',
            },
            unequip: {
                start: 19,
                end: 12,
                type: 'once',
            },
            mine: {
                start: 20,
                end: 22,
                type: 'boomerang',
            },
            eat: {
                start: 23,
                end: 51,
                type: 'once',
            },
            interact: {
                start: 52,
                end: 56,
                type: 'once',
            },
        },
    },
    chicken: {
        filename: 'chicken.png',
        width: 1,
        animations: {},
    },
    rock_big: {
        filename: 'rock_big.png',
        width: 1,
        animations: {},
    },
    rock_small: {
        filename: 'rock_small.png',
        width: 1,
        animations: {},
    },
    bush: {
        filename: 'bush.png',
        width: 1,
        animations: {},
    },
    tree_small: {
        filename: 'tree_small.png',
        width: 1,
        animations: {},
    },
    tree_big: {
        filename: 'tree_big.png',
        width: 1,
        animations: {},
    },
    tree_short: {
        filename: 'tree_short.png',
        width: 1,
        animations: {},
    },
    tree_tall: {
        filename: 'tree_tall.png',
        width: 1,
        animations: {},
    },
    grass_water_L: {
        filename: 'grass_water_L.png',
        width: 1,
        animations: {},
    },
    grass_water_R: {
        filename: 'grass_water_R.png',
        width: 1,
        animations: {},
    },
    grass_water_T: {
        filename: 'grass_water_T.png',
        width: 1,
        animations: {},
    },
    grass_water_B: {
        filename: 'grass_water_B.png',
        width: 1,
        animations: {},
    },
    grass_water_TL: {
        filename: 'grass_water_TL.png',
        width: 1,
        animations: {},
    },
    grass_water_RB: {
        filename: 'grass_water_RB.png',
        width: 1,
        animations: {},
    },
    grass_water_TR: {
        filename: 'grass_water_TR.png',
        width: 1,
        animations: {},
    },
    grass_water_BL: {
        filename: 'grass_water_BL.png',
        width: 1,
        animations: {},
    },
    grass_water_TBL: {
        filename: 'grass_water_TBL.png',
        width: 1,
        animations: {},
    },
    grass_water_TRL: {
        filename: 'grass_water_TRL.png',
        width: 1,
        animations: {},
    },
    grass_water_RBL: {
        filename: 'grass_water_RBL.png',
        width: 1,
        animations: {},
    },
    grass_water_TRB: {
        filename: 'grass_water_TRB.png',
        width: 1,
        animations: {},
    },
    grass_water_TRBL: {
        filename: 'grass_water_TRBL.png',
        width: 1,
        animations: {},
    },
    grass_water_corner_BL: {
        filename: 'grass_water_corner_BL.png',
        width: 1,
        animations: {},
    },
    grass_water_corner_BR: {
        filename: 'grass_water_corner_BR.png',
        width: 1,
        animations: {},
    },
    grass_water_corner_TL: {
        filename: 'grass_water_corner_TL.png',
        width: 1,
        animations: {},
    },
    grass_water_corner_TR: {
        filename: 'grass_water_corner_TR.png',
        width: 1,
        animations: {},
    },
};

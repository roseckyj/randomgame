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
};

import { Texture, Scene, StandardMaterial } from '@babylonjs/core';
import { textures } from './texturePack';

export interface texturePack {
    [name: string]: {
        filename: string;
        width: number;
        animations: { [name: string]: { start: number; end: number; type: 'loop' | 'once' | 'boomerang' | 'frame' } };
    };
}

let resourceFiles = Object.values(textures).map((texture) => texture.filename);
resourceFiles = resourceFiles.filter((v, i) => resourceFiles.indexOf(v) === i);

let atlases: { [key: string]: HTMLImageElement } = {};

let loaded = 0;

export const RESOURCES_LOCATION = '/randomgame/resources/textures/';

export function loadTextures(onLoad: () => void, onStateChange?: (loaded: number, of: number) => void) {
    if (resourceFiles.length === 0) {
        onStateChange && onStateChange(0, resourceFiles.length);
        onLoad();
    }

    resourceFiles.forEach((filename) => {
        atlases[filename] = new Image();
        atlases[filename].onload = () => {
            loaded++;
            onStateChange && onStateChange(loaded, resourceFiles.length);

            if (loaded === resourceFiles.length) {
                onLoad();
            }
        };
        atlases[filename].onerror = () => {
            console.error('Error loading resource file: ', filename);
        };
        atlases[filename].src = RESOURCES_LOCATION + filename;
    });

    return resourceFiles.length;
}

export function createTexture(texture: string, scene: Scene) {
    const t = new Texture(RESOURCES_LOCATION + textures[texture].filename, scene, false, true, Texture.NEAREST_NEAREST);
    t.uOffset = 0;
    t.vOffset = 0;
    t.uScale = 1 / textures[texture].width;
    t.vScale = 1;
    t.hasAlpha = true;
    return t;
}

export function createMaterial(texture: Texture, scene: Scene) {
    const material = new StandardMaterial('mat', scene);
    material.emissiveTexture = texture;
    material.opacityTexture = texture;

    return material;
}

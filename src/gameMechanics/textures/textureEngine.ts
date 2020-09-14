import { Vector2, Texture, Scene, StandardMaterial } from '@babylonjs/core';
import { textures } from './rexturePack';

export interface texturePack {
    [key: string]: { filename: string; corner: Vector2; size: Vector2 };
}

let resourceFiles = Object.values(textures).map((texture) => texture.filename);
resourceFiles = resourceFiles.filter((v, i) => resourceFiles.indexOf(v) === i);

let atlases: { [key: string]: HTMLImageElement } = {};

let loaded = 0;

export function loadTextures(onLoad: () => void, onStateChange?: (loaded: number, of: number) => void) {
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
        atlases[filename].src = 'resources/' + filename;
    });

    return resourceFiles.length;
}

export const TEXTURE_RESOLUTION = 50;
const DEFAULT_SCALE = 0.5;

export function createTexture(texture: string, scene: Scene) {
    const t = new Texture('resources/' + textures[texture].filename, scene, false, true, Texture.NEAREST_LINEAR);
    t.hasAlpha = true;
    return t;
}

export function drawTexture(
    ctx: CanvasRenderingContext2D,
    texture: string,
    x: number,
    y: number,
    width?: number,
    height?: number,
) {
    if (!Object.keys(textures).includes(texture)) {
        console.warn('Texture not found: ', texture);
        return;
    }

    const imageW = textures[texture].size.x;
    const imageH = textures[texture].size.y;

    const widthCalculated = width || imageW * DEFAULT_SCALE;
    const heightCalculated = height || (imageH * widthCalculated) / imageW;

    // ctx.strokeStyle = '#000000';
    // ctx.strokeRect(x, y, widthCalculated, heightCalculated);

    // console.log(x, y, widthCalculated, heightCalculated);

    ctx.drawImage(
        atlases[textures[texture].filename],
        textures[texture].corner.x,
        textures[texture].corner.y,
        imageW,
        imageH,
        x,
        y,
        widthCalculated,
        heightCalculated,
    );
}

export function createMaterial(texture: Texture, scene: Scene) {
    const material = new StandardMaterial('mat', scene);
    material.emissiveTexture = texture;
    material.opacityTexture = texture;

    return material;
}
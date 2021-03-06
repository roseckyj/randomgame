import { Texture, Scene, StandardMaterial, Material } from 'babylonjs';
import { SimpleTexture } from './SimpleTexture';
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
let materials: { [key: string]: Material } = {};

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
    const t = new Texture(
        RESOURCES_LOCATION + textures[texture].filename,
        scene,
        false,
        true,
        Texture.NEAREST_SAMPLINGMODE,
    );
    t.uOffset = 0;
    t.vOffset = 0;
    t.uScale = 1 / textures[texture].width;
    t.vScale = 1;
    t.hasAlpha = true;
    return t;
}

export function getSimpleMaterial(textureAtlas: string, scene: Scene) {
    if (materials[textureAtlas]) {
        return materials[textureAtlas];
    }

    const texture = new SimpleTexture(textureAtlas, scene);
    const material = createMaterial(texture.getTexture(), scene);
    materials[textureAtlas] = material;

    return material;
}

export function createMaterial(texture: Texture, scene: Scene, noAlpha?: true) {
    const material = new StandardMaterial('mat', scene);
    // Emissive:
    //material.emissiveTexture = texture;
    //if (!noAlpha) material.opacityTexture = texture;

    // Diffusive:
    material.diffuseTexture = texture;
    if (!noAlpha) material.opacityTexture = texture;
    material.specularColor = new BABYLON.Color3(0, 0, 0);

    return material;
}

export function getImage(texture: string): HTMLImageElement | null {
    if (!textures[texture]) {
        console.warn('Image ' + texture + ' not found!');
        return null;
    }
    return atlases[textures[texture].filename];
}

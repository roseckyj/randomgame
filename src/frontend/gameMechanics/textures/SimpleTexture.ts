import { Texture, Scene } from 'babylonjs';
import { textures } from './texturePack';
import { RESOURCES_LOCATION } from './textureEngine';

export class SimpleTexture {
    private texture: Texture;
    constructor(textureAtlas: string, private scene: Scene) {
        if (!textures[textureAtlas]) {
            throw new Error("Texture atlas '" + textureAtlas + "' is not defined");
        }

        const t = new Texture(
            RESOURCES_LOCATION + textures[textureAtlas].filename,
            scene,
            false,
            true,
            Texture.NEAREST_NEAREST,
        );
        t.hasAlpha = true;
        this.texture = t;
    }

    getTexture() {
        return this.texture;
    }

    detach() {
        this.scene.removeTexture(this.texture);
    }
}

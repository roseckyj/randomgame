import { Texture, Scene } from '@babylonjs/core';
import { textures } from './texturePack';
import { RESOURCES_LOCATION } from './textureEngine';

const TIME_PER_FRAME = 80;

export class AnimatedTexture {
    private textureAtlas: string;
    private texture: Texture;
    private animationQueue: { texture: string; skippable: boolean }[] = [];
    private frame: number = 0;
    private direction: number = 1;
    private interval: NodeJS.Timeout;

    private textureScale = 1;

    constructor(textureAtlas: string, scene: Scene, animation: string = 'default') {
        this.textureAtlas = textureAtlas;
        this.textureScale = 1 / textures[textureAtlas].width;

        const t = new Texture(
            RESOURCES_LOCATION + textures[textureAtlas].filename,
            scene,
            false,
            true,
            Texture.NEAREST_NEAREST,
        );
        t.uOffset = this.textureScale * textures[textureAtlas].animations[animation].start;
        t.vOffset = 0;
        t.uScale = this.textureScale;
        t.vScale = 1;
        t.hasAlpha = true;

        this.texture = t;

        this.queueAnimation(animation);
        this.interval = setInterval(() => this.tick(), TIME_PER_FRAME);

        (window as any).texture = this;
    }

    getTexture() {
        return this.texture;
    }

    isLast(animation: string) {
        return this.animationQueue[this.animationQueue.length - 1].texture === animation;
    }

    queueAnimation(animation: string, unskipable?: boolean) {
        if (!Object.keys(textures[this.textureAtlas].animations).includes(animation)) {
            console.warn('Animation does not exist');
            this.animationQueue.push({ texture: 'default', skippable: true });
            return;
        }

        if (this.animationQueue.length > 1 && this.animationQueue[this.animationQueue.length - 1].skippable) {
            this.animationQueue[this.animationQueue.length - 1] = { texture: animation, skippable: !unskipable };
        } else {
            this.animationQueue.push({ texture: animation, skippable: !unskipable });
        }
    }

    tick() {
        if (!this.texture) {
            console.error('Texture is null');
            return;
        }

        this.frame += this.direction;

        const animation = textures[this.textureAtlas].animations[this.animationQueue[0].texture];
        const framesCount = Math.abs(animation.start - animation.end);

        const haveNextAnimation = this.animationQueue.length > 1;

        if (this.frame > framesCount) {
            // At the right end

            switch (animation.type) {
                case 'loop':
                    this.direction = 1;
                    this.frame = 0;
                    if (haveNextAnimation) {
                        this.animationQueue.shift();
                    }
                    break;
                case 'once':
                    this.direction = 1;
                    if (haveNextAnimation) {
                        this.frame = 0;
                        this.animationQueue.shift();
                    } else {
                        this.frame = framesCount;
                    }
                    break;
                case 'boomerang':
                    this.direction = -1;
                    this.frame -= 2;
                    break;
                case 'frame':
                    this.direction = 1;
                    this.frame = 0;
                    if (haveNextAnimation) {
                        this.animationQueue.shift();
                    }
                    break;
            }
        }

        if (this.frame < 0) {
            // At the left end - Can happen just with boomerang
            this.direction = 1;
            if (haveNextAnimation) {
                this.frame = 0;
                this.animationQueue.shift();
            } else {
                this.frame = 0;
            }
        }

        const newAnimation = textures[this.textureAtlas].animations[this.animationQueue[0].texture];
        const animationDir = newAnimation.start > newAnimation.end ? -1 : 1;
        this.texture.uOffset = (this.frame * animationDir + newAnimation.start) * this.textureScale;
    }
}

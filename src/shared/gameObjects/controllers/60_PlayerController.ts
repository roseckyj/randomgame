import { Player } from '../60_Player';
import { keyBindings, KeyboardMotionController } from './20_KeyboardMotionController';
import { SmoothMotionController } from './20_SmoothMotionController';

export class PlayerController extends KeyboardMotionController {
    hasKeyboard: boolean = false;
    smoothMotionController: SmoothMotionController;
    keyboardController: KeyboardMotionController;

    constructor(object: Player) {
        super(object);

        this.smoothMotionController = new SmoothMotionController(object);
        this.keyboardController = new KeyboardMotionController(object);
    }

    // SmoothMotionController

    public ease(x: number, y: number, velocityX: number, velocityY: number) {
        if (this.hasKeyboard) return;

        this.smoothMotionController.ease(x, y, velocityX, velocityY);
    }

    public immediately(x: number, y: number, velocityX: number, velocityY: number) {
        if (this.hasKeyboard) return;

        this.smoothMotionController.immediately(x, y, velocityX, velocityY);
    }

    // KeyboardController

    public keyDown(keyCode: number) {
        if (!this.hasKeyboard) return;

        this.keyboardController.keyDown(keyCode);
    }

    public keyUp(keyCode: number) {
        if (!this.hasKeyboard) return;

        this.keyboardController.keyUp(keyCode);
    }

    public bindKeys(newBindings: Partial<keyBindings>) {
        this.keyboardController.bindKeys(newBindings);
        this.hasKeyboard = true;
    }

    tick(deltaTime: number) {
        if (this.hasKeyboard) {
            this.keyboardController.tick(deltaTime);
        } else {
            this.smoothMotionController.tick(deltaTime);
        }
    }
}

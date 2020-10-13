import { AbstractController } from '../00_AbstractController';

export abstract class AbstractInputController extends AbstractController {
    protected keysPressed: number[] = [];
    protected mousePressed: number[] = [];

    public keyDown(keyCode: number) {
        if (!this.keysPressed.includes(keyCode)) {
            this.keysPressed.push(keyCode);
        }
    }

    public keyUp(keyCode: number) {
        if (this.keysPressed.includes(keyCode)) {
            this.keysPressed = this.keysPressed.filter((key) => key !== keyCode);
        }
    }

    public mouseDown(keyCode: number) {
        if (!this.mousePressed.includes(keyCode)) {
            this.mousePressed.push(keyCode);
        }
    }

    public mouseUp(keyCode: number) {
        if (this.mousePressed.includes(keyCode)) {
            this.mousePressed = this.mousePressed.filter((key) => key !== keyCode);
        }
    }
}

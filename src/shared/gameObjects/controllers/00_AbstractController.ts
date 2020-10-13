import { AbstractGameObject } from '../00_AbstractGameObject';

export abstract class AbstractController {
    protected keysPressed: number[] = [];
    protected mousePressed: number[] = [];

    constructor(protected object: AbstractGameObject) {}

    abstract tick(deltaTime: number): void;

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

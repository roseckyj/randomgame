import { AbstractController } from './controllers/AbstractController';

export class ControllerManager {
    constructor(private controllers: AbstractController[] = []) {}

    public attach(controller: AbstractController) {
        this.controllers.push(controller);
    }

    public detach(filter: (controller: AbstractController) => boolean) {
        this.controllers = this.controllers.filter(filter);
    }

    public invoke(fn: string, ...args: any[]) {
        this.controllers.forEach((c) => (c as any)[fn] && (c as any)[fn](...args));
    }
}

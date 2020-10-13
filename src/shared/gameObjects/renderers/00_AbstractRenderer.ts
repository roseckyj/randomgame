import { Mesh } from "babylonjs/Meshes/mesh";
import { Scene } from "babylonjs/scene";
import { AbstractGameObject } from "../00_AbstractGameObject";

export abstract class AbstractRenderer {
    public attached: boolean = true;
    protected mesh: Mesh;
    
    constructor(protected object: AbstractGameObject, protected babylonScene: Scene) {}

    abstract async update(): Promise<void>;

    detach() {
        if (!this.attached) return;

        this.babylonScene.removeMesh(this.mesh, true);
        this.attached = false;
    }
}

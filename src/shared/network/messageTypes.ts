import { serializedEntity } from '../gameObjects/01_AbstractGameEntity';

export interface messageEntities {
    updated: serializedEntity<any>[];
    removed: serializedEntity<any>[];
}

export interface messageMapRequest {
    x: number;
    y: number;
}

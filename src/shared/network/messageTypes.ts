import { serializedEntity } from '../gameObjects/20_AbstractGameEntity';
import { serializedPlayer } from '../gameObjects/60_Player';

export interface messageEntities {
    updated: serializedEntity<any>[];
    removed: string[];
    time: number;
}

export interface messageMapRequest {
    x: number;
    y: number;
}

export interface messageLogin {
    name: string;
    passwordHash: string;
}

export interface messageError {
    error: string;
    description: string;
}

export interface messageUpdate {
    player: serializedEntity<serializedPlayer>;
    loadedChunks: string[];
}

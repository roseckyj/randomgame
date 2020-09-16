import { serializedPlayer } from "../../src/GameMechanics/gameObjects/Player";

export interface messageUpdate {
    id: string;
    content: serializedPlayer;
}

export interface messageMapRequest {
    x: number;
    y: number;
}
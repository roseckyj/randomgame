import { serializedPlayer } from "./gameObjects/Player";

export interface messageUpdate {
    id: number;
    content: serializedPlayer;
}

export interface messagePlayers {
    [key: string]: serializedPlayer;
}

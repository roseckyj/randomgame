import { NetworkServer } from './network/Server';
import { SimpleMapGenerator } from './mapGenerator/SimpleMapGenerator';
import { AbstractMapGenerator } from './mapGenerator/AbstractMapGenerator';
import { GameScene } from '../shared/gameObjects/Scene';

export class GameCore {
    gameScene: GameScene;
    mapGenerator: AbstractMapGenerator;
    networkServer: NetworkServer;
    timer: NodeJS.Timeout;

    constructor(port: number) {
        this.gameScene = new GameScene();
        this.mapGenerator = new SimpleMapGenerator(this.gameScene);
        this.networkServer = new NetworkServer(port, this.gameScene, this.mapGenerator);
        this.networkServer.open();

        this.timer = setInterval(() => {
            this.networkServer.sendUpdates();
        }, 100);
    }
}

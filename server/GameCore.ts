import { GameScene } from '../src/GameMechanics/gameObjects/Scene';
import { NetworkServer } from './network/Server';
import { SimpleMapGenerator } from './mapGenerator/SimpleMapGenerator';
import { AbstractMapGenerator } from './mapGenerator/AbstractMapGenerator';

export class GameCore {
    gameScene: GameScene;
    mapGenerator: AbstractMapGenerator;
    networkServer: NetworkServer;
    timer: NodeJS.Timeout;

    constructor(port: number) {
        this.gameScene = new GameScene();
        this.networkServer = new NetworkServer(port, this.gameScene, this.mapGenerator);
        this.networkServer.open();

        this.mapGenerator = new SimpleMapGenerator(this.gameScene);

        this.timer = setInterval(() => {
            this.networkServer.sendUpdates();
        }, 100);
    }
}

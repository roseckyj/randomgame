import { NetworkServer } from './network/Server';
import { SimpleMapGenerator } from './mapGenerator/SimpleMapGenerator';
import { AbstractMapGenerator } from './mapGenerator/AbstractMapGenerator';
import { GameScene } from '../shared/Scene';

const TICK_TIME = 10;
const UPDATE_TIME = 100;

export class GameCore {
    gameScene: GameScene;
    mapGenerator: AbstractMapGenerator;
    networkServer: NetworkServer;
    updateTimer: NodeJS.Timeout;
    tickTimer: NodeJS.Timeout;

    constructor(port: number, seed?: string) {
        this.gameScene = new GameScene();
        this.mapGenerator = new SimpleMapGenerator(
            this.gameScene,
            () => (id: string) => this.networkServer.setDirty([id]),
            seed ? parseInt(seed) : undefined,
        );
        this.networkServer = new NetworkServer(port, this.gameScene, this.mapGenerator);
        this.networkServer.open();
        console.log('Map seed: ', this.mapGenerator.seed);

        this.tickTimer = setInterval(() => {
            this.gameScene.tickAll(TICK_TIME);
        }, TICK_TIME);

        this.updateTimer = setInterval(() => {
            this.networkServer.sendUpdates();
        }, UPDATE_TIME);
    }
}

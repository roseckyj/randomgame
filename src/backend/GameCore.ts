import { NetworkServer } from './network/Server';
import { SimpleMapGenerator } from './mapGenerator/SimpleMapGenerator';
import { AbstractMapGenerator } from './mapGenerator/AbstractMapGenerator';
import { GameScene } from '../shared/Scene';
import { AbstractGameEntity } from '../shared/gameObjects/20_AbstractGameEntity';
import { convertCompilerOptionsFromJson } from 'typescript';

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
            () => (entity: AbstractGameEntity) => this.networkServer.setDirty([entity]),
            seed ? parseInt(seed) : undefined,
        );
        this.networkServer = new NetworkServer(port, this.gameScene, this.mapGenerator);
        this.networkServer.open();
        console.log('Map seed: ', this.mapGenerator.seed);

        this.tickTimer = setInterval(() => {
            this.gameScene.tickChunks(TICK_TIME, this.networkServer.getActiveChunks());
        }, TICK_TIME);

        /*
        this.tickTimer = setInterval(() => {
            console.log(
                Array.from(this.networkServer.getActiveChunks())
                    .map((c) =>
                        Array.from(c.entities)
                            .map((e) => e.id)
                            .join(', '),
                    )
                    .join(', '),
            );
        }, 1000);
        */

        this.updateTimer = setInterval(() => {
            this.networkServer.sendUpdates();
        }, UPDATE_TIME);
    }
}

import { NetworkServer } from './network/Server';
import { SimpleMapGenerator } from './mapGenerator/SimpleMapGenerator';
import { AbstractMapGenerator } from './mapGenerator/AbstractMapGenerator';
import { GameScene } from '../shared/Scene';
import { AbstractGameEntity } from '../shared/gameObjects/20_AbstractGameEntity';

const TICK_TIME = 10;
const UPDATE_TIME = 100;

export class GameCore {
    gameScene: GameScene;
    mapGenerator: AbstractMapGenerator;
    networkServer: NetworkServer;
    updateTimer: NodeJS.Timeout;
    tickTimer: NodeJS.Timeout;

    lastTick = new Date().getTime();

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

        this.update();
        this.tick();
    }

    tick() {
        const time = new Date().getTime();
        const deltaTime = time - this.lastTick;
        if (deltaTime > 200) {
            console.warn('Server is running less than 5 ticks per second! (' + deltaTime + 'ms per tick)');
        }
        this.gameScene.tickChunks(deltaTime, this.networkServer.getActiveChunks());
        this.lastTick = time;

        this.tickTimer = setTimeout(() => {
            this.tick();
        }, TICK_TIME);
    }

    update() {
        this.networkServer.sendUpdates();

        this.updateTimer = setTimeout(() => {
            this.update();
        }, UPDATE_TIME);
    }
}

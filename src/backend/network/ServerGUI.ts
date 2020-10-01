import express from 'express';
import { GameScene } from '../../shared/Scene';
import { setupDynmap } from './restApi/dynmap';
import { setupHomepage } from './restApi/homepage';

export class ServerGUI {
    constructor(private expressApp: express.Application, private scene: GameScene) {
        setupDynmap(expressApp, scene);
        setupHomepage(expressApp, scene);
    }
}

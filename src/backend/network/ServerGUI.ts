import express from 'express';
import { GameScene } from '../../shared/Scene';
import { setupDynmap } from './restApi/dynmap';
import { setupHomepage } from './restApi/homepage';
import { NetworkServer } from './Server';

export class ServerGUI {
    constructor(private expressApp: express.Application, private server: NetworkServer) {
        setupDynmap(expressApp, server.scene);
        setupHomepage(expressApp, server);
    }
}

import express from 'express';
import { GameScene } from '../../../../shared/Scene';
import { sendPlayerData } from './player';
import { sendTile } from './tile';

export function setupDynmap(expressApp: express.Application, scene: GameScene) {
    expressApp.get('/dynmap/', (req, res) => {
        res.sendFile(__dirname + '/staticFiles/dynmap.html');
    });

    expressApp.get('/dynmap/static/*', (req, res) => {
        res.sendFile(__dirname + '/staticFiles/' + req.params[0]);
    });

    expressApp.get('/dynmap/tile/*', (req, res) => {
        sendTile(scene, req, res);
    });

    expressApp.get('/dynmap/players', (req, res) => {
        sendPlayerData(scene, req, res);
    });
}

import express from 'express';
import { Player } from '../../../shared/gameObjects/60_Player';
import { GameScene } from '../../../shared/Scene';
import { NetworkServer } from '../Server';

export function setupHomepage(expressApp: express.Application, server: NetworkServer) {
    expressApp.get('/static/*', (req, res) => {
        res.sendFile(__dirname + '/staticFiles/' + req.params[0]);
    });

    const upSince = new Date();

    expressApp.get('/', (req, res) => {
        res.send(
            `<!DOCTYPE html>
        <html>
            <head>
                <link rel="stylesheet" href="./static/fonts.css" />
                <link rel="stylesheet" href="./static/style.css" />
                <meta charset="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        
                <title>Server randomgame</title>
            </head>
            <body>
                <h1>Server is running!</h1>
                <p>Current stats:</p>
                <ul>
                    <li>Up since: ` +
                upSince.toUTCString() +
                `</li>
                    <li>Entities: ` +
                server.scene.entities.length() +
                `</li>
                    <li>Chunks: ` +
                server.scene.chunks.length() +
                ` (active ` +
                server.getActiveChunks().size +
                `)` +
                `</li>
                    <li>Players online: ` +
                server.scene.entities.filter((entity) => entity instanceof Player && !entity.disabled).length() +
                `</li>
                </ul>
                <br/>
                <p><a href="./dynmap/" target="_blank">Server dynmap &gt;</a></p>
            </body>
        </html>
        `,
        );
    });
}

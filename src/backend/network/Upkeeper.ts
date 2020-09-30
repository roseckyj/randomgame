import { Response } from 'express';

export class Upkeeper {
    constructor(upkeepURL: string, interval: number) {
        const requestify = require('requestify');

        console.log('Upkeeper set up!');

        setInterval(() => {
            const upkeeper = requestify.get(upkeepURL) as Promise<Response>;
            //upkeeper.catch((reason) => console.error("upkeep ", reason.code));
            //upkeeper.then((response) => console.error("upkeep ", 200));
        }, interval);
    }
}

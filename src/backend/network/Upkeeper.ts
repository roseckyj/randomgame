export class Upkeeper {
    requestify = require('requestify');

    constructor(upkeepURL: string, interval: number) {
        setInterval(() => {
            this.requestify.get(upkeepURL).then(() => {});
        }, interval);
    }
}

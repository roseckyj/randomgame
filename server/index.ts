import { Upkeeper } from './network/Upkeeper';
import { GameCore } from './GameCore';

new Upkeeper(process.env.UPKEEP_URL || 'http://localhost:80/', 10000);
new GameCore(parseInt(process.env.PORT.toString()) || 80);

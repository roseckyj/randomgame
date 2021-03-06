import { Upkeeper } from './backend/network/Upkeeper';
import { GameCore } from './backend/GameCore';

new Upkeeper(process.env.UPKEEP_URL || 'http://localhost:80/', 5000);
new GameCore(process.env.PORT ? parseInt(process.env.PORT.toString()) : 80, process.env.SEED);

import { TgBot } from './src/bot';
import dotenv from 'dotenv';

dotenv.config({ path: './config/.env' });

console.log('Starting bot ...');

const tgBot = new TgBot();
tgBot.init();

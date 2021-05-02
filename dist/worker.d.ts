import { Worker } from 'discord-rose';
import GuildDB from './database/guilds';
declare class LucaWorker extends Worker {
    guildDB: GuildDB;
}
declare module 'discord-rose/dist/typings/lib' {
    type worker = LucaWorker;
}
export {};

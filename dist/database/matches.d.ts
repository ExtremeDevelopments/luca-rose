import { Cache } from 'discord-rose/dist/utils/Cache';
export default class MatchesDB {
    cache: Cache<string, MatchDoc>;
    getMatch(id: string): Promise<MatchDoc | null>;
    createMatch(mode: string, teamOne: string[], teamTwo: string[], ranked: boolean, guild: string, channel: string): Promise<void>;
}

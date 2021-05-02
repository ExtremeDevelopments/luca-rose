import { Cache } from 'discord-rose/dist/utils/Cache';
export default class GuildDB {
    guilds: Cache<string, GuildDoc>;
    getGuild(id: string): Promise<GuildDoc | null>;
}

import { Cache } from 'discord-rose/dist/utils/Cache';
export default class GuildDB {
    guilds: Cache<string, GuildDoc>;
    getGuild(id: string): Promise<GuildDoc>;
    createGuild(id: string): Promise<GuildDoc>;
    updateGuild(doc: GuildDoc): Promise<GuildDoc>;
    getPrefix(id: string): Promise<string>;
    setPrefix(id: string, prefix: string): Promise<GuildDoc>;
}

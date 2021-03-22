import { Cache } from 'discord-rose/dist/utils/Cache';

import GuildModel from './models/guild';

export default class GuildDB {
  /**
   * The guild's cache
   */
  guilds: Cache<string, GuildDoc> = new Cache(15 * 60 * 1000);

  /**
   * Get a guild doc from the cache/DB
   * @param id The ID of the guild
   */
  async getGuild(id: string): Promise<GuildDoc | null> {

    const fromCache = this.guilds.get(id);

    if (fromCache !== undefined) return fromCache;

    //DB Check

    const fromDB: GuildDoc = await GuildModel.findOne({ id }).lean();

    if (fromDB !== null) {

      this.guilds.set(id, fromDB);
      return fromDB;
    }

    return null;
  }
}
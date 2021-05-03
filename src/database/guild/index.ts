import { Cache } from '@jpbberry/cache'
import { Snowflake } from 'discord-rose'
import { Schema, model } from 'mongoose'

interface GuildDoc {
  id: Snowflake
  prefix: string
  options: {
    embed: boolean
    no_permissions: boolean
    lang: string
  }
  starboard: {
    minimum: number
    channel: Snowflake | null
  }
  moderation: {
    log_channel: Snowflake | null
    mute_role: Snowflake | null
  }
  toggles: {
    bans: boolean
    unbans: boolean
    mutes: boolean
    unmutes: boolean
    kicks: boolean
  }
}

const guildSchema = new Schema({
  id: { type: String, required: true, unique: true },
  prefix: { type: String, default: '-' },
  options: {
    embed: { type: Boolean, default: true },
    no_permissions: { type: Boolean, default: false },
    lang: { type: String, default: 'en-US' }
  },
  starboard: {
    minimum: { type: Number, default: 3 },
    channel: { type: String, default: null }
  },
  moderation: {
    log_channel: { type: String, default: null },
    mute_role: { type: String, default: null }
  },
  toggles: {
    bans: { type: Boolean, default: true },
    unbans: { type: Boolean, default: true },
    mutes: { type: Boolean, default: true },
    unmutes: { type: Boolean, default: true },
    kicks: { type: Boolean, default: true }
  }
})

const guildModel = model('guilds.config', guildSchema)

export class GuildDB {
  /**
   * The guild's cache
   */
  cache: Cache<string, GuildDoc> = new Cache(15 * 60 * 1000)

  /**
   * Get a guild doc from the cache/DB
   * @param id The ID of the guild
   */
  async getGuild (id: string): Promise<GuildDoc> {
    const fromCache = this.cache.get(id)

    if (fromCache !== undefined) return fromCache

    // DB Check

    const fromDB: GuildDoc = await guildModel.findOne({ id }).lean()

    if (fromDB !== null) {
      this.cache.set(id, fromDB)
      return fromDB
    }

    return await guildModel.create({ id })
  }

  /**
   * Update a guild in the DB
   * @param doc Already-existing guild document
   */
  public async updateGuild (doc: GuildDoc): Promise<void> {
    const id = doc.id
    this.cache.set(id, doc)

    await guildModel.updateOne({ id: doc.id }, doc, { upsert: true })
  }

  /**
   * Get a guild's prefix
   * @param id Guild ID
   */
  public async getPrefix (id: Snowflake): Promise<string> {
    const guildData = await this.getGuild(id)
    return guildData.prefix
  }

  /**
   * Set a guild's prefix
   * @param id Guild ID
   * @param prefix New prefix
   */
  public async setPrefix (id: Snowflake, prefix: string): Promise<void> {
    const guildData = await this.getGuild(id)
    guildData.prefix = prefix
    await this.updateGuild(guildData)
  }

  /**
   * Get whether or not to use embeds
   * @param id Guild ID
   */
  public async getEmbeds (id: Snowflake): Promise<boolean> {
    const guildData = await this.getGuild(id)
    return guildData.options.embed
  }

  /**
   * Set whether or not to use embeds
   * @param id Guild ID
   * @param value Whether or not to send embeds
   */
  public async setEmbeds (id: Snowflake, value: boolean): Promise<void> {
    const guildData = await this.getGuild(id)
    guildData.options.embed = value
    await this.updateGuild(guildData)
  }

  /**
   * Get the guild's log channel
   * @param id Guild ID
   */
  public async getLogChannel (id: Snowflake): Promise<Snowflake | null> {
    const guildData = await this.getGuild(id)
    return guildData.moderation.log_channel
  }

  /**
   * Set the guild's log channel
   * @param guildID Guild ID
   * @param channelID Channel ID
   */
  public async setLogChannel (guildID: Snowflake, channelID: Snowflake | null): Promise<void> {
    const guildData = await this.getGuild(guildID)
    guildData.moderation.log_channel = channelID
    await this.updateGuild(guildData)
  }
}

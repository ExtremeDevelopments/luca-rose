import { Cache } from '@jpbberry/cache'
import { Snowflake } from 'discord-rose'
import { Schema, model } from 'mongoose'

interface ModerationDoc {
  guild_id: Snowflake
  user_id: Snowflake
  case: number
  type: 'BAN' | 'UNBAN' | 'KICK' | 'MUTE' | 'UNMUTE'
  mod_id: Snowflake | null
  reason: string | null
  log_message: {
    channel_id: Snowflake
    message_id: Snowflake
  }
}

const moderationSchema = new Schema({
  guild_id: { type: String, required: true },
  user_id: { type: String, required: true },
  case: { type: Number, required: true }, // Case ID
  type: { type: String, required: true }, // ['BAN', 'UNBAN', 'KICK', 'MUTE', 'UNMUTE']
  mod_id: { type: String },
  reason: { type: String },
  log_message: {
    channel_id: { type: String },
    message_id: { type: String }
  }
})

const moderationModel = model('guilds.moderation', moderationSchema)

export class ModerationDB {
  /**
   * The guild's cache
   */
  cache: Cache<string, ModerationDoc> = new Cache(15 * 60 * 1000)

  /**
   * Get a guild doc from the cache/DB
   * @param id The ID of the guild
   */
  async getModeration (guildID: string, caseNum: number): Promise<ModerationDoc | null> {
    const cacheString = `${guildID}-${caseNum}`
    const fromCache = this.cache.get(cacheString)

    if (fromCache !== undefined) return fromCache

    // DB Check

    const fromDB: ModerationDoc = await moderationModel.findOne({ guild_id: guildID, case: caseNum }).lean()

    if (fromDB !== null) {
      this.cache.set(cacheString, fromDB)
      return fromDB
    }

    return null
  }

  /**
   * Update a guild in the DB
   * @param doc Already-existing guild document
   */
  public async updateModeration (doc: ModerationDoc): Promise<void> {
    const cacheString = `${doc.guild_id}-${doc.case}`
    this.cache.set(cacheString, doc)

    await moderationModel.updateOne({ guild_id: doc.guild_id, case: doc.case }, doc, { upsert: true })
  }

  public async createModeration (doc: ModerationDoc): Promise<void> {
    await moderationModel.create(doc)
  }
}

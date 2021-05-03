import { Snowflake, APIMessage, GatewayMessageDeleteDispatchData, GatewayGuildMemberAddDispatchData } from 'discord-api-types'
import { Embed } from 'discord-rose'
import { getAvatar, getIcon, getSnowflakeTimestamp } from '../../utils'
import { Worker } from './Worker'

interface LogMessage {
  channel_id: null | Snowflake
  message_id: null | Snowflake
}

export class ModerationLogger {
  constructor (private readonly worker: Worker) { }

  async save (guildID: Snowflake, caseNum: number, modID: Snowflake | null, userID: Snowflake, type: 'BAN' | 'UNBAN' | 'KICK' | 'MUTE' | 'UNMUTE', logMessage: LogMessage, reason?: string): Promise<void> {
    await this.worker.db.moderationDB.createModeration({
      case: caseNum,
      guild_id: guildID,
      mod_id: modID,
      log_message: logMessage,
      reason: reason ?? null,
      type: type,
      user_id: userID
    })
    await this.sendLog(guildID, caseNum)
  }

  async sendLog (guildID: Snowflake, caseNum: number): Promise<void> {
    const guildConf = await this.worker.db.guildDB.getGuild(guildID)
    if (!guildConf.moderation.log_channel) return

    const modDoc = await this.worker.db.moderationDB.getModeration(guildID, caseNum)
    if (!modDoc) return

    const moderator = modDoc.mod_id
      ? this.worker.members.get(guildID)?.get(modDoc.mod_id) ??
        await this.worker.api.members.get(guildID, modDoc.mod_id).catch(e => null)
      : undefined

    const user = this.worker.users.get(modDoc.user_id) ??
      await this.worker.api.users.get(modDoc.user_id) ??
      { username: 'Deleted User', discriminator: '0000', id: modDoc.user_id }

    const reason = modDoc.reason

    let color: number = this.worker.colors.YELLOW
    switch (modDoc.type) {
      case 'BAN': {
        color = this.worker.colors.SOFT_RED
        break
      }
      case 'KICK':
      case 'MUTE': {
        color = this.worker.colors.YELLOW
        break
      }
      case 'UNBAN':
      case 'UNMUTE': {
        color = this.worker.colors.GREEN
        break
      }
      default: break
    }

    let action: string = 'Unknown'
    switch (modDoc.type) {
      case 'BAN': {
        action = 'Ban'
        break
      }
      case 'KICK': {
        action = 'Kick'
        break
      }
      case 'MUTE': {
        action = 'Mute'
        break
      }
      case 'UNBAN': {
        action = 'Unban'
        break
      }
      case 'UNMUTE': {
        action = 'Unmute'
        break
      }
      default: break
    }

    const prefix = guildConf.prefix

    const embed = new Embed()
      .title(`${action} | Case #${modDoc.case}`)
      .field(
        'User',
        `${user?.username ?? ''}#${user?.discriminator ?? ''} (<@${user?.id ?? ''}>)`,
        true
      )
      .field(
        'Moderator',
        `${moderator ? `${moderator.user?.username ?? ''}#${moderator.user?.discriminator ?? ''}` : `??? (Moderator: do \`${prefix}reason ${modDoc.case}\`)`}`,
        true
      )
      .field(
        'Reason',
        `${reason ?? `Moderator: please do \`${prefix}reason ${modDoc.case} [reason]\``}`,
        false
      )
      .color(color)
      .timestamp()

    if (!guildConf.moderation.log_channel) return

    if (!modDoc.log_message.channel_id || !modDoc.log_message.message_id) {
      await this.worker.api.messages.send(guildConf.moderation.log_channel, embed)
        .then(async m => {
          modDoc.log_message = {
            channel_id: m.channel_id,
            message_id: m.id
          }
          await this.worker.db.moderationDB.updateModeration(modDoc)
        })
        .catch(() => {})
    } else {
      await this.worker.api.messages.edit(modDoc.log_message.channel_id, modDoc.log_message.message_id, { embed: embed.render() })
        .catch(async () => {
          await this.worker.api.messages.send(guildConf.moderation.log_channel as Snowflake, embed)
            .then(async m => {
              modDoc.log_message = {
                channel_id: m.channel_id,
                message_id: m.id
              }
              await this.worker.db.moderationDB.updateModeration(modDoc)
            })
            .catch(() => {})
        })
    }
  }

  async setReason (guildID: Snowflake, modID: Snowflake, caseNum: number, reason: string): Promise<void> {
    const modData = await this.worker.db.moderationDB.getModeration(guildID, caseNum)
    if (!modData) return

    modData.mod_id = modID
    modData.reason = reason

    await this.worker.db.moderationDB.updateModeration(modData)
    await this.sendLog(guildID, caseNum)
  }

  public async addMember (data: GatewayGuildMemberAddDispatchData): Promise<void> {
    if (!data.guild_id) return
    if (!data.user) return
    const guild = await this.worker.db.guildDB.getGuild(data.guild_id)
    if (!guild) return

    const user = this.worker.users.get(data.user.id) ?? await this.worker.api.users.get(data.user.id)
    if (!user) return
    if (!guild.moderation.server_log_channel) return

    const channel = this.worker.channels.get(guild.moderation.server_log_channel) ??
      await this.worker.api.channels.get(guild.moderation.server_log_channel).catch(e => null)

    if (!channel) return
    const embed = new Embed()
      .author('Member Joined', getAvatar(user))
      .description(`<@${user.id}> ${user.username}#${user.discriminator}`)
      .thumbnail(getAvatar(user))
      .field('Account Age', getSnowflakeTimestamp(user.id).toUTCString())
      .footer(`ID: ${user.id}`)
      .timestamp()

    await this.worker.api.messages.send(channel.id, embed)
  }

  public async deleteMessage (data: APIMessage | GatewayMessageDeleteDispatchData, userID?: Snowflake): Promise<void> {
    if (!data.guild_id) return

    const guild = this.worker.guilds.get(data.guild_id)
    if (!guild) return

    const guildData = await this.worker.db.guildDB.getGuild(data.guild_id)
    if (!guildData) return

    const user = userID
      ? this.worker.users.get(userID) ??
    await this.worker.api.users.get(userID).catch(e => null)
      : undefined

    if (!guildData.moderation.server_log_channel) return

    const channel = this.worker.channels.get(guildData.moderation.server_log_channel) ??
      await this.worker.api.channels.get(guildData.moderation.server_log_channel).catch(e => null)

    if (!channel) return

    const embed = new Embed()
      .author(user ? `${user.username}#${user.discriminator}` : guild.name, user ? getAvatar(user) : getIcon(guild))
      .description(user
        ? `**Message sent by <@${user.id}> deleted in <#${data.channel_id}>**\n${
          // @ts-expect-error
          // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
          data.content ?? 'Content not available'
        }`
        : `Message deleted in <#${data.channel_id}>\n`)
      .footer(`Author: ${user ? user.id : '?'} | Message ID: ${data.id}`)
      .timestamp()
      .color(this.worker.colors.SOFT_RED)

    await this.worker.api.messages.send(channel.id, embed)
  }

  private async action (type: 'BAN' | 'UNBAN' | 'KICK' | 'MUTE' | 'UNMUTE', guildID: Snowflake, modID: Snowflake | null, userID: Snowflake, reason?: string): Promise<void> {
    const guild = this.worker.guilds.get(guildID)
    if (!guild) return

    const user = this.worker.users.get(userID) ??
      await this.worker.api.users.get(userID).catch(e => null)

    if (!user) return

    const allCases = await this.worker.db.moderationDB.getAllCases(guildID)
    const caseNum = allCases.reduce((a, b) => b.case > a ? b.case : a, 0) + 1

    await this.save(guildID, caseNum, modID, userID, type, { channel_id: null, message_id: null }, reason)
  }

  public async ban (guildID: Snowflake, modID: Snowflake | null, userID: Snowflake, reason?: string): Promise<void> {
    await this.action('BAN', guildID, modID, userID, reason)
  }

  public async mute (guildID: Snowflake, modID: Snowflake | null, userID: Snowflake, reason?: string): Promise<void> {
    await this.action('MUTE', guildID, modID, userID, reason)
  }

  public async kick (guildID: Snowflake, modID: Snowflake | null, userID: Snowflake, reason?: string): Promise<void> {
    await this.action('KICK', guildID, modID, userID, reason)
  }

  public async unBan (guildID: Snowflake, modID: Snowflake | null, userID: Snowflake, reason?: string): Promise<void> {
    await this.action('UNBAN', guildID, modID, userID, reason)
  }

  public async unMute (guildID: Snowflake, modID: Snowflake | null, userID: Snowflake, reason?: string): Promise<void> {
    await this.action('UNMUTE', guildID, modID, userID, reason)
  }
}

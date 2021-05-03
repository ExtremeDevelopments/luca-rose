import { Worker } from '../lib/Worker'
import { GatewayGuildBanAddDispatchData } from 'discord-api-types'

export default async function (worker: Worker, data: GatewayGuildBanAddDispatchData): Promise<void> {
  const guild = worker.guilds.get(data.guild_id)
  const user = data.user
  if (!guild || !user) return

  const logChannelID = await worker.db.guildDB.getLogChannel(data.guild_id)
  if (!logChannelID) return

  const channel = worker.channels.get(logChannelID) ??
    await worker.api.channels.get(logChannelID)
  if (!channel) return

  const doc = worker.db.moderationDB.cache
    .array()
    .reverse()
    .find(
      e => e.user_id === user.id &&
        e.guild_id === guild.id &&
        e.type === 'BAN'
    )

  if (doc) return

  // implement audit logs here

  await worker.moderationLogger.ban(guild.id, null, user.id, undefined)
}

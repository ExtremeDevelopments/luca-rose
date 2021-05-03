import { Worker } from '../lib/Worker'
import { GatewayGuildBanAddDispatchData } from 'discord-api-types'

export default async function (worker: Worker, data: GatewayGuildBanAddDispatchData): Promise<void> {
  const guild = worker.guilds.get(data.guild_id)
  const user = data.user
  if (!guild || !user) return

  const logChannelID = await worker.db.guildDB.getLogChannel(data.guild_id)
  if (!logChannelID) return

  const channel = worker.channels.get(logChannelID)
  if (!channel) return

  console.log('a')
}

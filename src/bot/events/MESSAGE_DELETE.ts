import { Worker } from '../lib/Worker'
import { GatewayMessageDeleteDispatchData } from 'discord-api-types'

export default async function (worker: Worker, data: GatewayMessageDeleteDispatchData): Promise<void> {
  if (!data.guild_id) return

  const message = worker.messages.get(`${data.channel_id}-${data.id}`)
  await worker.moderationLogger.deleteMessage(message ?? data, message?.author.id)

  worker.messages.delete(`${data.channel_id}-${data.id}`)
}

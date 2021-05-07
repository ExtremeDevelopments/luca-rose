import { Worker } from '../lib/Worker'
import { GatewayMessageUpdateDispatchData, APIMessage } from 'discord-api-types'

export default async function (worker: Worker, data: GatewayMessageUpdateDispatchData): Promise<void> {
  if (!data.guild_id) return

  const oldMessage = worker.messages.get(`${data.channel_id}-${data.id}`) ?? {} as APIMessage
  const newMessage = Object.assign({}, oldMessage, data)

  await worker.moderationLogger.updateMessage(oldMessage, newMessage)

  if (!oldMessage) {
    const message = await worker.api.messages.get(newMessage.channel_id, newMessage.id)
      .catch(() => null)
    if (message) worker.messages.set(`${data.channel_id}-${data.id}`, message)
  } else worker.messages.set(`${data.channel_id}-${data.id}`, newMessage)
}

import { Worker } from '../lib/Worker'
import { APIMessage } from 'discord-api-types'

export default async function (worker: Worker, data: APIMessage): Promise<void> {
  if (!data.guild_id) return
  worker.messages.set(`${data.guild_id}-${data.id}`, data)

  if (data.content === '.') {
    await worker.api.messages.delete(data.channel_id, data.id)
      .catch(() => { })
  }
}

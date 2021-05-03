import { Worker } from '../lib/Worker'
import { GatewayGuildMemberAddDispatchData } from 'discord-api-types'

export default async function (worker: Worker, data: GatewayGuildMemberAddDispatchData): Promise<void> {
  await worker.moderationLogger.addMember(data)
}

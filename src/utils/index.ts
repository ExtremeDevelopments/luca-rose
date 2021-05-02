import { APIUser } from 'discord-api-types'
import { Cluster } from 'discord-rose'

import colors from 'colors/safe'

/**
 * Get the user's avatar
 * @param user The user to get the avatar from
 * @param user The user
 * @param type The type of image
 * @param size The size of the image
 */
export function getAvatar (user: APIUser, type?: string | null, size?: number | null): string {
  if (user.avatar) return `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}${type ? `.${type}` : ''}${size ? `?size=${size}` : ''}`
  return `https://cdn.discordapp.com/embed/avatars/${BigInt(user.discriminator) % BigInt(5)}.png`
}

export function createID (length: number = 16): string {
  let result: string = ''
  const numbers = '123456789'
  for (let i: number = 0; i < length; i++) {
    result += numbers[Math.floor(Math.random() * numbers.length)]
  }
  return result
}

/**
 * Get a formatted date
 * @param time A date
 */
export function getTime (time: Date): string {
  const hours = time.getHours().toString().padStart(2, '0') + 'h'
  const minutes = time.getMinutes().toString().padStart(2, '0') + 'm'
  const seconds = time.getSeconds().toString().padStart(2, '0') + 's'
  return `${hours}:${minutes}:${seconds}`
}

/**
 * Log function for master
 * @param cluster Cluster
 * @param length How long the longest name is
 * @param msg what to actually log
 */
export function log (cluster: Cluster | undefined, length: number, msg: string): void {
  const separator = '|'
  const date = getTime(new Date())
  const c = cluster
    ? `Cluster ${cluster.id}${' '.repeat(length - cluster.id.length)}`
    : `Master ${' '.repeat(length + 1)}`
  console.log(colors.yellow(date), separator, colors.red(c.toUpperCase()), separator, msg)
}

export const permissions = {
  addReactions: 'Add Reactions',
  administrator: 'Administrator',
  auditLog: 'View Audit Log',
  ban: 'Ban Members',
  connect: 'Connect to VC',
  createInvites: 'Create Invies',
  deafen: 'Deafen Members',
  embed: 'Embed Links',
  emojis: 'Emojis',
  externalEmojis: 'Use External Emojis',
  files: 'Upload Files',
  kick: 'Kick Members',
  manageChannels: 'Manage Channels',
  manageGuild: 'Manage Server',
  manageMessages: 'Manage Messages',
  manageNicknames: 'Manage Nicknames',
  manageRoles: 'Manage Roles',
  mentionEveryone: 'Mention Everyone',
  move: 'Move Members',
  mute: 'Mute Members',
  nickname: 'Change Members\' nicknames',
  prioritySpeaker: 'Priority Speaker',
  readHistory: 'Read Message History',
  sendMessages: 'Send Messages',
  speak: 'Speak',
  stream: 'Steam',
  tts: 'Text To Speech',
  useVoiceActivity: 'Use Voice Activity',
  viewChannel: 'View Channel',
  viewInsights: 'View Insights',
  webhooks: 'Create Webhook'
}

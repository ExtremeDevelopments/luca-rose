import { CommandOptions, Snowflake } from 'discord-rose'
import { APIUser } from 'discord-api-types'

import { getAvatar } from '../../../utils'

export default {
  command: 'owner',
  aliases: ['owners'],
  category: 'bots',
  description: 'Shows all owners of that bot.',
  exec: async ctx => {
    if (!ctx.worker.topgg) return await ctx.error('This command is not currently enabled')

    const botID =
      ctx.message.mentions[0]?.id ??
      ((ctx.args[0] || '').replace(/[<@!>]/g, '') as Snowflake)

    if (!botID) return await ctx.error('Please include a bot mention or ID')

    const data = await ctx.worker.topgg.getBot(botID)

    const owners = (await Promise.all(
      data.owners.map(user => ctx.worker.topgg?.getUser(user))
    ))

    if (ctx.message.content.includes('noembed')) {
      await ctx.send(
        `${data.username} is owned by ${owners.map(
          user => `${user?.username ?? ''}#${user?.discriminator ?? ''}${user?.certifiedDev ? ' <:certified:838857121134018600>' : ''}`
        ).join(', ')
        }`
      )
      return
    }

    await ctx.embed
      .author(data.username, getAvatar(data as APIUser), `https://top.gg/users/${data.id}`)
      .title('Owners')
      .description(
        owners.map(
          user => `<@${user?.id ?? ''}>${user?.certifiedDev ? ' <:certified:838857121134018600>' : ''}`
        ).join('\n')
      )
      .send()
  }
} as CommandOptions

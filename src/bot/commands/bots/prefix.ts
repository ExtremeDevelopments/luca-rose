import { CommandOptions, Snowflake } from 'discord-rose'
import { APIUser } from 'discord-api-types'

import { getAvatar } from '../../../utils'

export default {
  command: 'prefix',
  aliases: [],
  category: 'bots',
  description: 'Get prefix of a bot from top.gg',
  exec: async ctx => {
    if (!ctx.worker.topgg) return await ctx.error('This command is not currently enabled')

    const botID =
      ctx.message.mentions[0]?.id ??
      ((ctx.args[0] || '').replace(/[<@!>]/g, '') as Snowflake)

    if (!botID) return await ctx.error('Please include a bot mention or ID')

    const data = await ctx.worker.topgg.getBot(botID)

    if (ctx.message.content.includes('noembed')) {
      await ctx.send(`${data.username}'s prefix is \`${data.prefix}\``)
      return
    }

    await ctx.embed
      .author(data.username, getAvatar(data as APIUser), `https://top.gg/users/${data.id}`)
      .title('Prefix')
      .description(`\`${data.prefix}\``)
      .send()
  }
} as CommandOptions

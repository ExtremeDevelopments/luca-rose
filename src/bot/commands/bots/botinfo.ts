import { CommandOptions, Snowflake } from 'discord-rose'
import { APIUser } from 'discord-api-types'

import { getAvatar } from '../../../utils'

export default {
  command: 'botinfo',
  aliases: ['bi'],
  category: 'bots',
  description: 'Shows bot info, title redirects to site listing.',
  exec: async ctx => {
    if (!ctx.worker.topgg) return await ctx.error('This command is not currently enabled')

    const botID =
      ctx.message.mentions[0]?.id ??
      ((ctx.args[0] || '').replace(/[<@!>]/g, '') as Snowflake)

    if (!botID) return await ctx.error('Please include a bot mention or ID')

    const data = await ctx.worker.topgg.getBot(botID)
      .catch(() => null)

    if (!data) return await ctx.error('That bot wasn\'t found')

    await ctx.embed
      .author(data.username, getAvatar(data as APIUser), `https://top.gg/users/${data.id}`)
      .thumbnail(getAvatar(data as APIUser))
      .field('ID', data.id, true)
      .field('Username', data.username, true)
      .field('Discriminator', String(data.discriminator), true)
      .field('Short Description', data.shortdesc, true)
      .field('Library', data.lib || 'null', true)
      .field('Prefix', data.prefix, true)
      .field('Total Upvotes', data.points.toString(), true)
      .field('Monthly Upvotes', data.monthlyPoints.toString(), true)
      .field(
        'Server Count',
        // @ts-expect-error
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        `${data.server_count} Server${data.server_count > 1 ? 's' : ''} | ${data.shard_count ?? 1} Shard${data.shard_count > 1 ? 's' : ''}`,
        true
      )
      .field(
        'Owner(s)',
        (await Promise.all(data.owners.map(id => ctx.worker.topgg?.getUser(id))))
          .map(user =>
            user
              ? `<@${user.id}>${user?.certifiedDev ? ' <:certified:838857121134018600>' : ''}`
              : ''
          )
          .filter(e => !!e)
          .join('\n'),
        true
      )
      .send()
  }
} as CommandOptions

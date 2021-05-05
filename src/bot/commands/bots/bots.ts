import { CommandOptions } from 'discord-rose'
import { getAvatar } from '../../../utils'

export default {
  command: 'bots',
  aliases: [],
  category: 'bots',
  description: 'Shows the prefix of that bot.',
  exec: async (ctx) => {
    if (!ctx.worker.dblstats) return await ctx.error('This command is not currently enabled')

    const userID = ctx.message.mentions[0]?.id ??
      ((ctx.args[0] || '').replace(/[<@!>]/g, '') ||
      ctx.message.author.id)

    const data = await ctx.worker.dblstats.getUsersBots(userID)
      .catch(() => null)

    if (!data?.bots) return await ctx.error('User not found')

    if (ctx.message.content.includes('noembed')) {
      await ctx.send(
        `${ctx.message.author.username}#${ctx.message.author.discriminator}'s bots:\n ${data.bots
          .map(
            bot => `<@${bot.id}>${bot.certified ? '<:certified:838857121134018600>' : ''}`
          )
          .join(' ')
        }`
      )
      return
    }

    await ctx.embed
      .author(
        `${ctx.message.author.username}#${ctx.message.author.discriminator}`,
        getAvatar(ctx.message.author),
        `https://top.gg/users/${data.user.id}`
      )
      .title('Bots')
      .description(
        data.bots
          .map(
            bot => `<@${bot.id}>${bot.certified ? '<:certified:838857121134018600>' : ''}`
          )
          .join('\n')
      )
      .send()
  }
} as CommandOptions

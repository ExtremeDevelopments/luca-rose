import { CommandOptions } from 'discord-rose'
import { getAvatar } from '../../utils'

export default {
  command: 'help',
  cooldown: 3e3,
  category: 'information',
  description: 'Get help with the bot',
  usage: 'help [command]',
  aliases: [],
  exec: async (ctx) => {
    const guildPrefix = '-'

    const cmd = ctx.args[0]
    const url = getAvatar(ctx.message.author, null, null)

    if (!ctx.worker.commands.commands) return await ctx.error('No commands loaded!')

    if (cmd) {
      const command = ctx.worker.commands.commands.find(e => e.command === cmd)
      if (command) {
        await ctx.embed
          // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
          .author(ctx.message.author.username + ' | ' + ctx.command.command, url)
          .description(`\`Command\`: ${command.command as string}\n\`Description\`: ${command.description ?? 'None'}`)
          .footer('Extreme is cool')
          .color(ctx.worker.colors.PURPLE)
          .timestamp()
          .send()
      } else {
        return ctx.error(`Command \`${cmd}\` not found.`)
      }
    } else {
      const userIsOwner = false
      // @ts-expect-error
      const categories = ctx.worker.commands.commands.reduce((a, b) => a.includes(b.category) ? a : a.concat([b.category]), [])

      const embed = ctx.embed
        // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
        .author(ctx.message.author.username + ' | ' + ctx.command.command, url)
        .title('Commands')
        .footer('Extreme is cool')
        .color(ctx.worker.colors.PURPLE)
        .timestamp()

      categories.forEach((cat) => {
        if (!cat) return
        if (cat === 'owner' && !userIsOwner) return
        if (!ctx.worker.commands.commands) return
        const desc = ctx.worker.commands.commands.filter(x => x.category === cat && !x.disabled).map(cmd_ => `\`${guildPrefix}${cmd_.command as string}\`: ${cmd_.description ?? 'None'}`).join('\n')
        if (!desc) return
        // @ts-expect-error
        // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
        embed.field(cat.charAt(0).toUpperCase() + cat.substr(1), desc)
      })
      await embed
        .send(true)
    }
  }
} as CommandOptions

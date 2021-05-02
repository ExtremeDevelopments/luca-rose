import { CommandOptions } from 'discord-rose/dist/typings/lib'
import { NonFatalError } from '../lib/NonFatalError'
import { getAvatar } from '../utils';

export default {
  command: 'help',
  cooldown: 3e3,
  category: 'information',
  description: 'Get help with the bot',
  usage: 'help [command]',
  aliases: [],
  exec: async (ctx) => {
    const guildPrefix = '-';

    const cmd = ctx.args[0];
    const url = getAvatar(ctx.message.author, null, null);
    if (!ctx.worker.commands.commands) throw new NonFatalError(`No commands loaded!`)
    if (cmd) {
      const command = ctx.worker.commands.commands.find(e => e.command === cmd);
      if (command) {
        await ctx.embed
          .author(ctx.message.author.username + ' | ' + ctx.command.command, url)
          .description(`\`Command\`: ${command.command}\n\`Description\`: ${command.description}`)
          .footer('Extreme is cool')
          .color(PURPLE)
          .timestamp()
          .send()
        return;
      } else {
        throw new NonFatalError(`Command "${cmd}" not found.`)
      }
    } else {
      const userIsOwner = false;
      //@ts-ignore
      const categories = ctx.worker.commands.commands.reduce((a, b) => a.includes(b.category) ? a : a.concat([b.category]), []);

      const embed = ctx.embed
        //@ts-ignore
        .author(ctx.message.author.username + ' | ' + ctx.command.command, url)
        .title('Commands')
        .footer('Extreme is cool')
        .color(PURPLE)
        .timestamp();

      categories.forEach((cat) => {
        if (!cat) return;
        if (cat === 'owner' && !userIsOwner) return;
        if (!ctx.worker.commands.commands) throw new NonFatalError(`No commands loaded!`)
        const desc = ctx.worker.commands.commands.filter(x => x.category === cat && !x.disabled).map(cmd_ => `\`${guildPrefix}${cmd_.command}\`: ${cmd_.description}`).join('\n');
        if (!desc) return
        //@ts-ignore
        embed.field(cat.charAt(0).toUpperCase() + cat.substr(1), desc);
      });
      await embed
        .send(true)
    }
  }
} as CommandOptions

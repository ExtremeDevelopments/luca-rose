import { CommandOptions } from 'discord-rose'

export default {
  command: 'BLANKCOMMANDHERE',
  aliases: [],
  category: 'test',
  description: 'test',
  exec: async (ctx) => {
    await ctx.error('Command not implemented')
  }
} as CommandOptions

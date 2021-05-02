import { CommandOptions } from 'discord-rose'

export default {
  command: 'throw',
  aliases: [],
  category: 'throw',
  description: 'throw',
  exec: async (ctx) => {
    throw new Error(ctx.args.join(' ') || 'TEST')
  }
} as CommandOptions

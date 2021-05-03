import { CommandOptions } from 'discord-rose'

export default {
  command: 'setprefix',
  permissions: ['manageMessages'],
  category: 'Moderation',
  description: 'Set my prefix.',
  exec: async (ctx) => {
    if (!ctx.args[0]) {
      const prefix = await ctx.worker.db.guildDB.getPrefix(ctx.id)
      await ctx.respond(`Current prefix: ${prefix}`)
      return
    }

    const prefix = ctx.args.join(' ')
    if (!prefix) {
      await ctx.error('No prefix was included')
      return
    }

    await ctx.worker.db.guildDB.setPrefix(ctx.id, prefix)

    await ctx.respond(
      `Prefix set to \`${prefix}\``,
      {
        type: 'YES'
      }
    )
  }
} as CommandOptions

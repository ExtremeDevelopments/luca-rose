import { CommandContext } from 'discord-rose/dist/typings/lib'

export default () => {
  return async (ctx: CommandContext) => {
    if (!ctx.command.owner) return true
    if (!['300438546236571658'].includes(ctx.message.author.id)) {
      await ctx.error('You can\'t do this!')
      return
    }
    return true
  }
}

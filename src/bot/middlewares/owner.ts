import { CommandContext } from 'discord-rose/dist/typings/lib'

export default () => {
  return async (ctx: CommandContext) => {
    if (!ctx.command.owner) return true
    const isOwner = await ctx.worker.db.userDB.getOwner(ctx.message.author.id)
    if (!isOwner) {
      await ctx.error('You can\'t do this!')
      return false
    }
    return true
  }
}

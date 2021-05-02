import { CommandContext } from 'discord-rose/dist/typings/lib'

export default () => {
  return async (ctx: CommandContext) => {
    if (ctx.command.disabled) {
      await ctx.error('This command is currently disabled')
      return
    }
    return true
  }
}

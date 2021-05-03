import { CommandOptions } from 'discord-rose'

export default {
  command: 'reason',
  aliases: [],
  category: 'moderation',
  userPerms: ['manageMessages'],
  description: 'Apply reason to a ban | kick | mute',
  exec: async (ctx) => {
    await ctx.delete()

    if (!ctx.args[0]) return
    const caseNum = Number(ctx.args[0])
    if (isNaN(caseNum)) return

    const modDoc = await ctx.worker.db.moderationDB.getModeration(ctx.id, caseNum)
    if (!modDoc) return

    const reason = ctx.args.slice(1).join(' ') || 'None'
    await ctx.worker.moderationLogger.setReason(ctx.id, ctx.message.author.id, caseNum, reason)
  }
} as CommandOptions

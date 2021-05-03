import { CommandOptions } from 'discord-rose'
import { Snowflake } from 'discord-api-types'

export default {
  command: 'kick',
  aliases: ['k'],
  category: 'Moderation',
  description: 'Kick a member from the server.',
  myPerms: ['kick'],
  userPerms: ['kick'],
  exec: async (ctx) => {
    if (!ctx.guild) return
    const reason = ctx.args.slice(1).join(' ')
    const userID = (ctx.args[0] || '').replace(/[<@!>]/g, '') as Snowflake
    const member = ctx.worker.members.get(ctx.guild.id ?? ctx.message.author.id)?.get(userID) ??
      await ctx.worker.api.members.get(ctx.id, userID).catch(e => null)

    if (!member) {
      await ctx.error('I couldn\'t find a member to kick')
      return
    }

    const guildRoles = ctx.worker.guildRoles.get(ctx.guild.id)?.array()

    const userRole = guildRoles
      ?.filter(r => ctx.member.roles.includes(r.id))
      .map(r => r.position)
      .reduce((a, r) => r > a ? r : a, 0) ?? 0

    const memberRole = guildRoles
      ?.filter(r => member.roles.includes(r.id))
      .map(r => r.position)
      .reduce((a, r) => r > a ? r : a, 0) ?? 0

    const myRole = guildRoles
      ?.filter(r => ctx.worker.members.get(ctx.guild?.id as Snowflake)?.get(ctx.worker.user.id)?.roles.includes(r.id))
      .map(r => r.position)
      .reduce((a, r) => r > a ? r : a, 0) ?? 0

    if (memberRole >= userRole) return ctx.error('You can\'t kick this member')
    if (myRole <= memberRole) return ctx.error('I can\'t kick this member')

    await ctx.worker.moderationLogger.kick(ctx.id, ctx.message.author.id, userID, reason || undefined)
    await ctx.worker.api.members.kick(ctx.guild.id, member.user?.id as Snowflake)

    await ctx.respond(
      `**Kicked** ${member.user?.username ?? ''}#${member.user?.discriminator ?? ''} (<@${member.user?.id ?? ''}>)`,
      {
        color: ctx.worker.colors.ORANGE,
        type: 'KICK'
      }
    )
  }
} as CommandOptions

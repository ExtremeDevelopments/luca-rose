import { CommandOptions } from 'discord-rose'
import { Snowflake } from 'discord-api-types'

export default {
  command: 'ban',
  aliases: ['b'],
  category: 'Moderation',
  description: 'Ban a member of the server.',
  exec: async (ctx) => {
    if (!ctx.guild) return
    const UserID = (ctx.args[0] || '').replace(/[<@!>]/g, '') as Snowflake
    const member = ctx.worker.members.get(ctx.guild.id ?? ctx.message.author.id)?.get(UserID)
    if (!member) {
      await ctx.error('I couldn\'t find a member to ban')
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

    if (!myRole || !memberRole || !userRole) return
    if (memberRole >= userRole) return ctx.error('You can\'t ban this member')
    if (myRole <= memberRole) return ctx.error('I can\'t ban this member')

    await ctx.worker.api.members.ban(ctx.guild.id, member.user?.id as Snowflake)

    await ctx.respond(
      `**Banned** ${member.user?.username ?? ''}#${member.user?.discriminator ?? ''} (<@${member.user?.id ?? ''}>)`,
      {
        color: ctx.worker.colors.ORANGE,
        type: 'BAN'
      }
    )
  }
} as CommandOptions
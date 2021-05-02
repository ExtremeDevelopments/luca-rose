import { CommandOptions } from 'discord-rose'
import { NonFatalError } from '../lib/NonFatalError'
import { Snowflake } from 'discord-api-types'
export default {
  command: 'ban',
  aliases: ['b'],
  category: 'Moderation',
  description: 'Ban a member of the server.',
  exec: async (ctx) => {
    if (!ctx.guild) return;
    const UserID = (ctx.args[0] || '').replace(/[<@!>]/g, '') as Snowflake
    const member = ctx.worker.members.get(ctx.guild.id ?? ctx.message.author.id)?.get(UserID);
    if (!member) throw new NonFatalError('<:tickNo:821117686905438209> I couldn\'t find a member to ban')

    const guildRoles = ctx.worker.guildRoles.get(ctx.guild.id)?.array();

    const userRole = guildRoles?.filter(r => ctx.member.roles.includes(r.id)).map(r => r.position).reduce((a, r) => r > a ? r : a, 0)
    const memberRole = guildRoles?.filter(r => member.roles.includes(r.id)).map(r => r.position).reduce((a, r) => r > a ? r : a, 0)
    const myRole = guildRoles?.filter(r => ctx.worker.members.get(ctx.guild?.id as Snowflake)?.get(ctx.worker.user.id)?.roles.includes(r.id)).map(r => r.position).reduce((a, r) => r > a ? r : a, 0)

    if (!myRole || !memberRole || !userRole) return;
    if (memberRole >= userRole) throw new NonFatalError('<:tickNo:821117686905438209> You can\'t ban this member')
    if (myRole <= memberRole) throw new NonFatalError('<:tickNo:821117686905438209> I can\'t ban this member')

    await ctx.worker.api.members.ban(ctx.guild.id, member.user?.id as Snowflake);
    
    await ctx.embed
      .description(`<:banHammer:821162351507669043> banned ${member.user?.username}#${member.user?.discriminator} (${member})`)
      .color(ORANGE)
      .send()
  }
} as CommandOptions

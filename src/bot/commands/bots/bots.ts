import { CommandOptions, Snowflake } from 'discord-rose'

export default {
    command: 'bots',
    aliases: [],
    category: 'bots',
    description: 'Get bots of a user or yourself',
    exec: async (ctx) => {
        if (!ctx.guild) return;
        const userID = ctx.message.mentions[0]?.id ?? (ctx.args[0] || '').replace(/[<@!>]/g, '') as Snowflake
        let member = ctx.worker.members.get(ctx.guild.id ?? ctx.message.author.id)?.get(userID) ??
            await ctx.worker.api.members.get(ctx.id, userID)

        if (!member) member = ctx.member;
    }
} as CommandOptions

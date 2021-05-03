import { CommandOptions, Snowflake } from 'discord-rose'
import fetch from 'node-fetch';
export default {
    command: 'botinfo',
    aliases: ['bi'],
    category: 'bots',
    description: 'Get information of a bot on top.gg',
    exec: async (ctx) => {
        const userID = ctx.message.mentions[0]?.id ?? (ctx.args[0] || '').replace(/[<@!>]/g, '') as Snowflake;
        if(!userID) return ctx.error(`You must provide a bot mention or ID`)
        const data = await fetch(`https://top.gg/api/bots/${userID}`, {
            method: 'GET',
            headers: {
                "Authorization":"topgg-token"
            }
        })
        ctx.embed
        .author(data.username, `discord.com/users/${data.id}/avatars/${data.avatar}`) // Pretty sure this is incorrect avatar link
        .field('ID', data.id, true)
        .field('Username', data.username)
        .field('Discriminator', data.discriminator)
        .field('Short Description', data.shortdesc)
        .field('Library', data.lib)
        .field('Prefix', data.prefix)
        .field('Total Upvotes', data.points)
        .field('Monthly Upvotes', data.monthlyPonumbers)
        .field('Server Count', data.guilds)
        .field('Owner(s)', 'Add later')
        
    }
} as CommandOptions

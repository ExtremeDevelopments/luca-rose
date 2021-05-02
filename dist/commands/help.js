"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const NonFatalError_1 = require("../lib/NonFatalError");
const utils_1 = require("../utils");
exports.default = {
    command: 'help',
    cooldown: 3e3,
    category: 'information',
    description: 'Get help with the bot',
    usage: 'help [command]',
    aliases: [],
    exec: (ctx) => __awaiter(void 0, void 0, void 0, function* () {
        const guildPrefix = '-';
        const cmd = ctx.args[0];
        const url = utils_1.getAvatar(ctx.message.author, null, null);
        if (!ctx.worker.commands.commands)
            throw new NonFatalError_1.NonFatalError(`No commands loaded!`);
        if (cmd) {
            const command = ctx.worker.commands.commands.find(e => e.command === cmd);
            if (command) {
                yield ctx.embed
                    .author(ctx.message.author.username + ' | ' + ctx.command.command, url)
                    .description(`\`Command\`: ${command.command}\n\`Description\`: ${command.description}`)
                    .footer('Extreme is cool')
                    .color(PURPLE)
                    .timestamp()
                    .send();
                return;
            }
            else {
                throw new NonFatalError_1.NonFatalError(`Command "${cmd}" not found.`);
            }
        }
        else {
            const userIsOwner = false;
            const categories = ctx.worker.commands.commands.reduce((a, b) => a.includes(b.category) ? a : a.concat([b.category]), []);
            const embed = ctx.embed
                .author(ctx.message.author.username + ' | ' + ctx.command.command, url)
                .title('Commands')
                .footer('Extreme is cool')
                .color(PURPLE)
                .timestamp();
            categories.forEach((cat) => {
                if (!cat)
                    return;
                if (cat === 'owner' && !userIsOwner)
                    return;
                if (!ctx.worker.commands.commands)
                    throw new NonFatalError_1.NonFatalError(`No commands loaded!`);
                const desc = ctx.worker.commands.commands.filter(x => x.category === cat && !x.disabled).map(cmd_ => `\`${guildPrefix}${cmd_.command}\`: ${cmd_.description}`).join('\n');
                if (!desc)
                    return;
                embed.field(cat.charAt(0).toUpperCase() + cat.substr(1), desc);
            });
            yield embed
                .send(true);
        }
    })
};

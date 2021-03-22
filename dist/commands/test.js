"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    command: 'test',
    exec: async (ctx) => {
        await ctx.reply('h');
        return;
    }
};

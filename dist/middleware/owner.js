"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const NonFatalError_1 = require("../lib/NonFatalError");
exports.default = () => {
    return (ctx) => {
        if (!ctx.command.owner)
            return true;
        if (!['300438546236571658'].includes(ctx.message.author.id))
            throw new NonFatalError_1.NonFatalError('You can\'t do this!');
        return true;
    };
};

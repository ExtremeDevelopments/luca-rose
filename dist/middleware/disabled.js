"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const NonFatalError_1 = require("../lib/NonFatalError");
exports.default = () => {
    return (ctx) => {
        if (ctx.command.disabled)
            throw new NonFatalError_1.NonFatalError('This command is currently disabled');
        return true;
    };
};

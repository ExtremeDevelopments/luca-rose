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
exports.default = {
    command: 'find',
    cooldown: 3e3,
    aliases: [],
    description: "Find a new match",
    category: 'matchmaking',
    usage: "find [mode] <ranked | unranked>",
    exec: (ctx) => __awaiter(void 0, void 0, void 0, function* () {
        ctx.send(`Hecc`);
        console.log(ctx.args);
        if (!ctx.args[0])
            throw new NonFatalError_1.NonFatalError(`You must choose a mode to play`);
        console.log(ctx.args[0]);
    })
};

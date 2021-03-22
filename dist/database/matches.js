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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Cache_1 = require("discord-rose/dist/utils/Cache");
const utils_1 = require("../utils");
const guild_1 = __importDefault(require("./models/guild"));
class MatchesDB {
    constructor() {
        this.cache = new Cache_1.Cache(15 * 60 * 1000);
    }
    getMatch(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const fromCache = this.cache.get(id);
            if (fromCache !== undefined)
                return fromCache;
            const fromDB = yield guild_1.default.findOne({ id }).lean();
            if (fromDB !== null) {
                this.cache.set(id, fromDB);
                return fromDB;
            }
            return null;
        });
    }
    createMatch(mode, teamOne, teamTwo, ranked, guild, channel) {
        return __awaiter(this, void 0, void 0, function* () {
            let ID = utils_1.createID();
            while (yield this.getMatch(ID)) {
                ID = utils_1.createID();
            }
            yield guild_1.default.create({
                mode,
                ranked,
                guildID: guild,
                channelID: channel,
                teams: {
                    one: teamOne,
                    two: teamTwo
                }
            });
        });
    }
}
exports.default = MatchesDB;

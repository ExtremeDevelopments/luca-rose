"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const guildSchema = new mongoose_1.Schema({
    id: { type: String, required: true, unique: true },
    prefix: { type: String, default: '-' },
    options: {
        embed: { type: Boolean, default: true },
        no_permissions: { type: Boolean, default: false },
    },
    starboard: {
        minimum: { type: Number, default: 3 },
        channel: { type: String, default: null }
    },
    moderation: {
        log_channel: { type: String, default: null },
        mute_role: { type: String, default: null }
    },
    toggles: {
        bans: { type: Boolean, default: true },
        unbans: { type: Boolean, default: true },
        mutes: { type: Boolean, default: true },
        unmutes: { type: Boolean, default: true },
        kicks: { type: Boolean, default: true },
    }
});
exports.default = mongoose_1.model('guilds.config', guildSchema);

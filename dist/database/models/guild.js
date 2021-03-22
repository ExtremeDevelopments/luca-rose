"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const guildSchema = new mongoose_1.Schema({
    id: { type: String, required: true, unique: true },
    prefix: { type: String, default: "!" },
    premium_status: { type: Boolean, default: false },
    log: { type: String, default: null },
    staff_roles: { type: Array },
    logged: {
        match_void: { type: Boolean, default: true },
        party_create: { type: Boolean, default: false },
        party_disband: {
            staff: { type: Boolean, default: true },
            member: { type: Boolean, default: false }
        },
        match_end: {
            ranked: { type: Boolean, default: true },
            unranked: { type: Boolean, default: true },
        }
    }
});
exports.default = mongoose_1.model('guilds', guildSchema);

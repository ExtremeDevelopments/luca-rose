"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const matchesSchema = new mongoose_1.Schema({
    id: { type: String, required: true },
    guildID: { type: String, required: true },
    channelID: { type: String, required: true },
    teams: {
        one: { type: Array, required: true },
        two: { type: Array, required: true },
    },
    mode: { type: String, required: true },
    ranked: { type: Boolean, required: true }
});
exports.default = mongoose_1.model('guilds', matchesSchema);

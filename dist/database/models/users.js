"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    guildID: { type: String, required: true },
    userID: { type: String, required: true },
    elo: {
        current: { type: Number, required: true, default: 0 },
        total_gained: { type: Number, required: true, default: 0 },
        total_lost: { type: Number, required: true, default: 0 },
    },
    matches_played: { type: Number, required: true, default: 0 }
});
exports.default = mongoose_1.model('users', userSchema);

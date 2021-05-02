"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_json_1 = __importDefault(require("./config.json"));
const discord_rose_1 = require("discord-rose");
const path_1 = require("path");
const master = new discord_rose_1.Master(path_1.resolve(__dirname, 'worker.js'), {
    token: config_json_1.default.token,
    shards: 'auto',
    shardsPerCluster: 1,
    cache: {
        users: true,
        members: true
    }
});
master.start();

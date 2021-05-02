"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_json_1 = __importDefault(require("./config.json"));
const discord_rose_1 = require("discord-rose");
const path_1 = require("path");
const utils_1 = require("./utils");
const master = new discord_rose_1.Master(path_1.resolve(__dirname, './bot/index.js'), {
    token: config_json_1.default.DISCORD_TOKEN,
    shards: 'auto',
    shardsPerCluster: 1,
    intents: 32767,
    cache: {
        users: true,
        members: true
    },
    log: (msg, cluster) => {
        utils_1.log(cluster, master.processes.reduce((a, c) => c.id.length > a ? c.id.length : a, 1), msg);
    }
});
master.start()
    .then(() => { })
    .catch((err) => { throw err; });

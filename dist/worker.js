"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
global.GREEN = 0x2ECC71;
global.RED = 0xFF0000;
global.PURPLE = 0xb649eb;
global.ORANGE = 0xFFA500;
const fs_1 = require("fs");
const discord_rose_1 = require("discord-rose");
const path_1 = require("path");
const cooldown_middleware_1 = __importDefault(require("@discord-rose/cooldown-middleware"));
const flags_middleware_1 = __importDefault(require("@discord-rose/flags-middleware"));
const permissions_middleware_1 = __importDefault(require("@discord-rose/permissions-middleware"));
const owner_1 = __importDefault(require("./middleware/owner"));
const disabled_1 = __importDefault(require("./middleware/disabled"));
const guilds_1 = __importDefault(require("./database/guilds"));
const worker = new discord_rose_1.Worker();
class LucaWorker extends discord_rose_1.Worker {
    constructor() {
        super(...arguments);
        this.guildDB = new guilds_1.default();
    }
}
worker.commands
    .prefix(() => { return '-'; })
    .error((ctx, err) => {
    ctx.embed
        .color(0xF44444)
        .description(err.nonFatal ? err.message : err.toString())
        .send(true)
        .catch(() => { });
    if (!err.nonFatal)
        ctx.worker.log(`🔽\n`, err);
})
    .middleware(cooldown_middleware_1.default())
    .middleware(flags_middleware_1.default())
    .middleware(permissions_middleware_1.default())
    .middleware(owner_1.default())
    .middleware(disabled_1.default());
const commandFiles = fs_1.readdirSync(path_1.resolve(__dirname, 'commands'), { withFileTypes: true })
    .filter(f => f.isFile() && f.name.endsWith('.js'));
for (const file of commandFiles) {
    const commands = require(path_1.resolve(__dirname, 'commands', file.name));
    for (const command of Object.values(commands)) {
        worker.commands.add(command);
    }
}

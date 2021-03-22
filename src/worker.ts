global.GREEN = 0x2ECC71
global.RED = 0xFF0000
global.PURPLE = 0xb649eb
global.ORANGE = 0xFFA500

import { readdirSync } from 'fs';

import { Worker, CommandOptions } from 'discord-rose';
import { resolve } from 'path';
import { getAvatar } from './utils'

import cooldownMiddleware from '@discord-rose/cooldown-middleware'
import flagsMiddleware from '@discord-rose/flags-middleware'
import permissionsMiddleware from '@discord-rose/permissions-middleware'
import owner from './middleware/owner';
import disabled from './middleware/disabled';
import GuildDB from './database/guilds';
const worker = new Worker();
class LucaWorker extends Worker {
  guildDB = new GuildDB();
}
declare module 'discord-rose/dist/typings/lib' {
  type worker = LucaWorker;
}
worker.commands
  .prefix(() => { return '-' })
  .error((ctx, err) => {
    
    ctx.embed
      .author(err.nonFatal ? err.message : err.toString(), getAvatar(ctx.message.author, null, null))
      .color(RED)
      .send(true)
      .catch(() => { });
    if (!err.nonFatal) ctx.worker.log(`🔽\n`, err)
  })
  .middleware(cooldownMiddleware())
  .middleware(flagsMiddleware())
  .middleware(permissionsMiddleware())
  .middleware(owner())
  .middleware(disabled())
const commandFiles = readdirSync(resolve(__dirname, 'commands'), { withFileTypes: true })
  .filter(f => f.isFile() && f.name.endsWith('.js'))

for (const file of commandFiles) {
  const commands = require(resolve(__dirname, 'commands', file.name))
  for (const command of Object.values(commands)) {
    worker.commands.add(command as CommandOptions)
  }
}
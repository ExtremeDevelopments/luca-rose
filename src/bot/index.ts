import config from '../config.json'

import { Worker } from './lib/Worker'
import path from 'path'

import cooldownMiddleware from '@discord-rose/cooldown-middleware'

const worker = new Worker(
  {
    database: config.MONGO,
    topgg: config.TOPGG
      ? {
          token: config.TOPGG.TOKEN,
          options: config.TOPGG.OPTIONS
        }
      : undefined,
    dblstats: config.DBLSTATS
      ? {
          token: config.DBLSTATS.TOKEN
        }
      : undefined
  }
)

worker.loadEvents(path.resolve(__dirname, './events'))
worker.loadMiddlewares(path.resolve(__dirname, './middlewares'))

worker.setStatus('watching', 'Discord Bots', 'online')

worker.commands
  .load(path.resolve(__dirname, './commands'))
  .middleware(cooldownMiddleware())

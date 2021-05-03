import config from '../config.json'

import { Worker } from './lib/Worker'
import path from 'path'

import cooldownMiddleware from '@discord-rose/cooldown-middleware'

const worker = new Worker({ database: config.MONGO })

worker.loadEvents(path.resolve(__dirname, './events'))
worker.loadMiddlewares(path.resolve(__dirname, './middlewares'))

worker.setStatus('watching', 'Discord Bots', 'online')

worker.commands
  .load(path.resolve(__dirname, './commands'))
  .middleware(cooldownMiddleware())

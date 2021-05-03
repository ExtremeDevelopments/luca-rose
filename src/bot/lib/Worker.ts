import { Worker as Wkr } from 'discord-rose'
import fs from 'fs'

import flagsMiddleware from '@discord-rose/flags-middleware'

import { DB, DBOptions } from '../../database'
import { CommandContext } from './CommandContext'
import { colors } from './colors'

import * as utils from '../../utils'
import { ModerationLogger } from './ModerationLogger'
import { Api } from '@top-gg/sdk'
import DBLStats from 'dblstatistics.js'
import { APIMessage } from 'discord-api-types'
import { Cache } from '@jpbberry/cache'

interface TopGGOptions {
  token: string
  options?: any
}

interface DBLStatsOptions {
  token: string
}

interface WorkerOptions {
  database: DBOptions
  topgg?: TopGGOptions
  dblstats?: DBLStatsOptions
}

/**
 * Worker class
 * @example
 * const worker = new Worker()
 */
export class Worker extends Wkr {
  db: DB

  colors = colors
  utils = utils
  moderationLogger: ModerationLogger
  topgg?: Api
  dblstats?: DBLStats

  messages: Cache<string, APIMessage>

  /**
   * Create the bot
   * @param options The options lol
   */
  constructor (options: WorkerOptions) {
    super()

    this.db = new DB(options.database)
    this.moderationLogger = new ModerationLogger(this)

    this.topgg = options.topgg ? new Api(options.topgg.token) : undefined
    this.dblstats = options.dblstats ? new DBLStats(options.dblstats.token) : undefined
    this.messages = new Cache(1.44e+7)

    this.commands.CommandContext = CommandContext
    this.commands.middleware(flagsMiddleware())
    this.commands.options({
      bots: false,
      caseInsensitiveCommand: true,
      caseInsensitivePrefix: true,
      mentionPrefix: true
    })

    this.commands.prefix(async msg => {
      const id = msg.guild_id ?? msg.author.id
      return await this.db.guildDB.getPrefix(id)
    })

    this.commands.error((ctx, err) => {
      ctx
        .respond(err.nonFatal ? err.message : `Error: ${err.message}`, {
          reply: err.nonFatal,
          type: err.nonFatal ? 'NO' : 'ERROR'
        })
        .then(() => {})
        .catch(() => {})
    })
  }

  /**
   * Load many commands
   * @param dir Directory to search
   * @example
   * worker.loadEvents(path.resolve(__dirname, 'events/'))
   */
  public loadEvents (dir: string): void {
    const files = fs.readdirSync(dir, { withFileTypes: true })
    files.forEach(file => {
      const filePath = dir + '/' + file.name
      if (file.isDirectory()) return this.loadEvents(filePath)
      if (!file.name.endsWith('.js')) return

      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const event: (worker: Worker, ...data: any[]) => {} = require(filePath).default
      this.on(file.name.slice(0, -3) as any, event.bind(null, this))

      delete require.cache[require.resolve(filePath)]
    })
  }

  /**
   * Load many middlewares
   * @param dir Directory to search
   * @example
   * worker.loadMiddlewares(path.resolve(__dirname, 'middleware/'))
   */
  public loadMiddlewares (dir: string): void {
    const files = fs.readdirSync(dir, { withFileTypes: true })
    files.forEach(file => {
      const filePath = dir + '/' + file.name
      if (file.isDirectory()) return this.loadMiddlewares(filePath)
      if (!file.name.endsWith('.js')) return

      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const required = require(filePath)
      const middleware = required.default ? required.default : required
      this.commands.middleware(middleware())

      delete require.cache[require.resolve(filePath)]
    })
  }

  /**
   * A nicely formatted memory stats
   * @example
   * worker.mem
   * // {
   * //   rss: '120.1MB',
   * //   heapTotal: '62.1MB',
   * //   heapUsed: '27.7MB',
   * //   external: '18.9MB',
   * //   arrayBuffers: '17.5MB'
   * // }
   */
  get mem (): NodeJS.MemoryUsage {
    return Object.entries(process.memoryUsage()).reduce<any>((T, [K, V]) => {
      T[K] = (V / 1024 ** 2).toFixed(1) + 'MB'
      return T
    }, {})
  }
}

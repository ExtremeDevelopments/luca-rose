import { DB, DBOptions } from '../../database'
import { LoadRoutes as loadRoutes } from '@jpbberry/load-routes'
import { RestManager, Thread } from 'discord-rose'

import express from 'express'
import path from 'path'

interface APIOptions {
  database: DBOptions
  webhook: WebhookOptions
  port: number
  token: string
  url?: string
}

interface WebhookOptions {
  auth: string
}

export class API {
  db = new DB(this.options.database)
  comms = new Thread()
  rest = new RestManager(this.options.token)
  app = express()

  constructor (public readonly options: APIOptions) {
    loadRoutes(this.app, path.resolve(__dirname, '../routes/'), this)

    this.app.set('trust-proxy', true)
    this.app.set('views', path.join(__dirname, '/views'))

    this.app.use('/', express.static(path.join(__dirname, '/public')))
    this.app.use(express.json())
    this.app.use(express.urlencoded({ extended: true }))

    this.app.listen(options.port, () => {
      this.comms.log('Starting on port', options.port)
    })
  }
}

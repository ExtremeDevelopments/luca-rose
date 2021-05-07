import { Thread, RestManager } from 'discord-rose'
import { DB } from '../database'

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Application {
      comms: Thread
      db: DB
      api: RestManager
    }
  }
}

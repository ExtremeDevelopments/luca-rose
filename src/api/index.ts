import config from '../config.json'

import { API } from './structures/API'

export default new API({
  database: config.MONGO,
  port: config.TOPGG.WEBHOOK.PORT,
  token: config.DISCORD_TOKEN,
  webhook: {
    auth: config.TOPGG.WEBHOOK.AUTH
  }
})

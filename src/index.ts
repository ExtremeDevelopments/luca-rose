import config from './config.json'

import { Master } from 'discord-rose'
import { resolve } from 'path'

import { log } from './utils'

const master = new Master(resolve(__dirname, './bot/index.js'), {
  token: config.DISCORD_TOKEN,
  shards: 'auto',
  shardsPerCluster: 1,
  intents: 32511,
  cache: {
    users: true,
    members: true
  },
  log: (msg: string, cluster: any) => {
    log(cluster, master.processes.reduce((a, c) => c.id.length > a ? c.id.length : a, 1), msg)
  }
})

master.spawnProcess('API', resolve(__dirname, './api/index.js'))

master.start()
  .then(() => { })
  .catch((err) => { throw err })

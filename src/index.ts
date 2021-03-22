import config from './config.json';

import { Master } from 'discord-rose';
import { resolve } from 'path';

const master = new Master(resolve(__dirname, 'worker.js'), {
  token: config.token,
  shards: 'auto',
  shardsPerCluster: 1,
})

master.start()

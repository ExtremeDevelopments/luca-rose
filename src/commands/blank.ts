import { CommandOptions } from 'discord-rose'
import { NonFatalError } from '../lib/NonFatalError'

export default {
  command: 'BLANKCOMMANDHERE',
  aliases: [],
  category: 'test',
  description: 'test',
  disabled: true,
  exec: async (ctx) => {
    throw new NonFatalError('Command not implemented')
  }
} as CommandOptions

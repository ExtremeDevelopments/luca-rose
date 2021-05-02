import { Worker as Wkr } from './bot/lib/Worker'
import { CommandContext as CmdCtx } from './bot/lib/CommandContext'
import { bits } from 'discord-rose/dist/utils/Permissions'

declare module 'discord-rose/dist/typings/lib' {
  interface CommandOptions {
    owner?: boolean
    disabled?: boolean
    description?: string
    category?: string
    userPerms?: Array<keyof typeof bits>
    myPerms?: Array<keyof typeof bits>
  }

  interface CommandContext extends CmdCtx { }
  type worker = Wkr
}

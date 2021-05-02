import { APIMessage, Snowflake } from 'discord-api-types'

import { CommandContext as CmdCtx } from 'discord-rose'

interface RespondOptions {
  mention?: boolean
  embed?: boolean
  reply?: boolean
  error?: boolean
  color?: number
  type?: keyof typeof responseTypes
}

export const responseTypes = {
  BAN: '<:banHammer:821162351507669043> ',
  KICK: '👞 ',
  NO: '<:tickNo:821117686905438209> ',
  YES: '<:tickYes:821126043485732874> ',
  ERROR: '',
  NONE: ''
}

export class CommandContext extends CmdCtx {
  flags: any

  /**
   * Get whether or not a guild sends embeds
   * @example
   * ctx.getEmbeds()
   * // false
   */
  get embeds (): Promise<boolean> {
    return this.worker.db.guildDB.getEmbeds(this.id)
  }

  /**
   * The real ID because this is how its gonna go
   * @example
   * ctx.getID
   * // 810951119731294218
   */
  get id (): Snowflake {
    return this.guild?.id ?? this.message.author.id
  }

  /**
   * Respond in a nice format
   * @param message What to respond
   */
  async respond (message: string, options: RespondOptions = {}): Promise<APIMessage | null> {
    if (this.flags.s) return null

    options.embed = options.embed === undefined ? !!await this.worker.db.guildDB.getEmbeds(this.id) : options.embed

    if (!options.embed || this.flags.noembed) {
      const response = await this.send({ content: message })
        .catch(() => undefined)

      return response ?? null
    }

    // @ts-expect-error
    options.type = responseTypes[this.flags.type]
      ? this.flags.type
      : options.type ?? 'NONE'

    options.error = options.error === undefined
      ? this.flags.error
      : options.error

    options.reply = options.reply === undefined
      ? this.flags.reply
      : options.reply

    options.mention = options.mention === undefined
      ? this.flags.mention
      : options.mention

    options.color = options.color ??
      (options.type === 'ERROR'
        ? this.worker.colors.RED
        : undefined) ??
      (options.type === 'KICK'
        ? this.worker.colors.YELLOW
        : undefined) ??
      (['BAN', 'MUTE', 'NO'].includes(options.type ?? '')
        ? this.worker.colors.SOFT_RED
        : undefined) ??
      (options.type === 'YES'
        ? this.worker.colors.GREEN
        : undefined
      ) ??
      (options.error
        ? this.worker.colors.RED
        : this.worker.colors.GREEN)

    if (this.flags.noreply) options.reply = false
    if (this.flags.nomention) options.mention = false

    const response = await this.embed
      .description(`${responseTypes[options.type ?? 'NONE']}${message}`)
      .color(options.color)
      .send(options.reply, !!options.mention)
      .catch(() => undefined)

    return response ?? null
  }

  /**
   * Await a response to a message
   * @param filter Filter to check before resolving
   * @param timeout How long to wait
   */
  async awaitResponse (filter: (m: APIMessage) => {} = () => true, timeout: number = 15000): Promise<APIMessage> {
    return await new Promise((resolve, reject) => {
      const func = (m: APIMessage): void => {
        if (!filter(m)) return
        resolve(m)
        this.worker.off('MESSAGE_CREATE', func)
      }

      this.worker.setMaxListeners(this.worker.getMaxListeners() + 1)
      this.worker.on('MESSAGE_CREATE', func)

      setTimeout(() => {
        this.worker.off('MESSAGE_CREATE', func)
        this.worker.setMaxListeners(this.worker.getMaxListeners() - 1)
        reject(new Error('Response Timeout Exceeded'))
      }, timeout)
    })
  }
}

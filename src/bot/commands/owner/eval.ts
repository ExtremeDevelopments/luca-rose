
import { CommandOptions } from 'discord-rose'

import util from 'util'

function clean (text: string): string {
  if (typeof (text) === 'string') { return text.replace(/`/g, '`' + String.fromCharCode(8203)).replace(/@/g, '@' + String.fromCharCode(8203)) } else { return text }
}

let last
// eslint-disable-next-line @typescript-eslint/no-unused-vars
let temp: any

export default {
  description: 'Eval code on the worker process',
  category: 'owner',
  command: 'eval',
  aliases: ['ev'],
  owner: true,
  exec: async (ctx) => {
    const worker = ctx.worker

    try {
      const code = ctx.args.join(' ')

      let evaled: string | string[]
      if (ctx.flags.m) evaled = await worker.comms.masterEval(code)
      else if (ctx.flags.b) evaled = await worker.comms.broadcastEval(code)
      // eslint-disable-next-line no-eval
      else evaled = eval(code)

      if (evaled instanceof Promise) evaled = await evaled

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      if (ctx.flags.l) last = evaled

      if (typeof evaled !== 'string') { evaled = util.inspect(evaled) }

      if (ctx.flags.s || ctx.flags.silent) return

      await ctx.embed
        .color(ctx.worker.colors.GREEN)
        .title('Eval Successful')
        .description(`\`\`\`xl\n${evaled}\`\`\``)
        .send()
    } catch (err) {
      if (ctx.flags.s || ctx.flags.silent) return

      void ctx.embed
        .color(ctx.worker.colors.RED)
        .title('Eval Unsuccessful')
        .description(`\`\`\`xl\n${clean(err)}\`\`\``)
        .send()
        .catch(() => {})
    }
  }
} as CommandOptions
/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express'
import { API } from '../structures/API'

import { Webhook } from '@top-gg/sdk'
import { Snowflake } from 'discord-rose'

export default function (this: API, router: Router): void {
  const webhook = new Webhook(this.options.webhook.auth)

  router.post('/webhook', webhook.listener(async (vote, req, res) => {
    if (!req || !res) return

    const user = await req.app.api.users.get(vote.user as Snowflake)
    if (!user) return

    await this.db.voteDB.addVote(vote.user, {
      bot: vote.bot ?? 'none',
      date: new Date().toString(),
      worth: vote.isWeekend ? 2 : 1,
      query: vote.query
    })

    // TODO: Webhooks for votes
  }))
}

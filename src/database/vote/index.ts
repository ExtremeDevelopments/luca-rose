import { Cache } from '@jpbberry/cache'

import { Schema, model } from 'mongoose'

const voteSchema = new Schema({
  id: { type: String, required: true, unique: true },
  total_votes: { type: Number, default: 1 },
  votes_worth: { type: Number, default: 1 },
  votes: { type: Array, default: [] }
})

const voteModel = model('users.votes', voteSchema)

interface VoteDoc {
  id: string
  total_votes: number
  votes_worth: number
  votes: Vote[]
}

interface Vote {
  date: string
  worth: 1 | 2
  number?: number
  query?: string | {
    [key: string]: string
  }
  bot: string
}

export default class VoteDB {
  /**
   * The Settings
   */
  cache: Cache<string, VoteDoc> = new Cache(0)

  /**
   * Get a VoteDoc
   * @param id User ID
   */
  async getVotes (id: string): Promise<VoteDoc> {
    // Check the cache first
    const fromCache = this.cache.get(id)
    if (fromCache !== undefined) return fromCache

    // Then check the DB
    const fromDB: VoteDoc = await voteModel.findOne({ id }).lean()
    if (fromDB !== null) {
      // Add it to the cache
      this.cache.set(id, fromDB)
      return fromDB
    }

    // Otherwise create a new one
    return {
      id,
      total_votes: 0,
      votes: [],
      votes_worth: 0
    }
  }

  /**
   * Create the default level doc
   * @param userID User ID
   * @param guildID Guild ID
   */
  async createVote (id: string): Promise<VoteDoc> {
    await voteModel.create({ id })
    return await this.getVotes(id)
  }

  /**
   * Update a user's Level doc
   * @param doc The already-existing level document
   */
  async addVote (id: string, vote: Vote): Promise<VoteDoc> {
    const votes = await this.getVotes(id)

    vote.number = votes.votes.length
    votes.votes.push(vote)
    votes.total_votes++
    votes.votes_worth = votes.votes_worth + vote.worth

    this.cache.set(id, votes)
    return voteModel.findOneAndUpdate({ id }, votes, { upsert: true }).lean() as unknown as VoteDoc
  }
}

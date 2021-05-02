import { Schema, model } from 'mongoose'

const starboardSchema = new Schema({
  channelID: { type: String, required: true },
  messageID: { type: String, required: true },
  star_count: { type: Number, default: 1 },
  starMessageID: { type: String, required: true }
})

export default model('guilds.starboard', starboardSchema)

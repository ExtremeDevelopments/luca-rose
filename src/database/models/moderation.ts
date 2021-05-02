import { Schema, model } from 'mongoose'

const moderationSchema = new Schema({
  guildID: { type: String, required: true },
  userID: { type: String, required: true },
  case: { type: Number, required: true }, // Case ID
  type: { type: String, required: true }, // ['BAN', 'UNBAN', 'KICK', 'MUTE', 'UNMUTE']
  modID: { type: String },
  reason: { type: String },
  messageID: { type: String }
})

export default model('guilds.moderation', moderationSchema)

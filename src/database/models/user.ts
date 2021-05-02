import { Schema, model } from 'mongoose'

const userSchema = new Schema({
  id: { type: String, required: true, unique: true },
  nostar: { type: Boolean }
})

export default model('users.config', userSchema)

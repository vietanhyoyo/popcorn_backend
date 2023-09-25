const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Type = new Schema(
  {
    id: { type: Number },
    name: { type: String, maxlength: 255 }
  },
  {
    timestamps: true
  }
)

module.exports = mongoose.model('Type', Type)

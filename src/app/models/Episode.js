const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Episode = new Schema(
  {
    id: { type: String },
    name: { type: String, maxlength: 255 },
    slug: { type: String },
    description: { type: String },
    release_date: { type: Date },
    season_id: { type: String },
    code: { type: String },
  },
  {
    timestamps: true
  }
)

module.exports = mongoose.model('Episode', Episode)

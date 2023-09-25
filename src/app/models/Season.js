const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Season = new Schema(
  {
    id: { type: Number },
    name: { type: String, maxlength: 255 },
    slug: { type: String },
    film_id: { type: Number },
    release_date: { type: Date },
  },
  {
    timestamps: true
  }
)

module.exports = mongoose.model('Season', Season)

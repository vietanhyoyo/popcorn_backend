const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Film = new Schema(
  {
    id: { type: Number },
    slug: { type: String },
    name: { type: String, maxlength: 255 },
    thumbnail: { type: String },
    backdrop: { type: String },
    type: { type: Number },
    release_date: { type: Date },
    is_banner: { type: Number },
    is_recent: { type: Number },
    is_new: { type: Number },
    is_popular: { type: Number },
    path: { type: String },
    themoviedb_id: {type: String,},
    description: { type: String },
  },
  {
    timestamps: true
  }
)

module.exports = mongoose.model('Film', Film)

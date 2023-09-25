const mongoose = require('mongoose')
const Schema = mongoose.Schema

const SoundTrack = new Schema(
  {
    id: { type: Number },
    name: { type: String, maxlength: 255 },
    slug: { type: String },
    episode_id: { type: Number },
    description: { type: String },
    artist: { type: String },
    itune_link: { type: String },
    amazon_link: { type: String },
    apple_link: { type: String },
    spotify_link: { type: String },
    youtube_link: { type: String },
    film_id: { type: Number },
    is_play: { type: Number },
    sort: { type: String },
  },
  {
    timestamps: true
  }
)

module.exports = mongoose.model('SoundTrack', SoundTrack)

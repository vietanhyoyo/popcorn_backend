const Season = require('../models/Season')
const Episode = require('../models/Episode')
const Film = require('../models/Film')

class EpisodeController {
  async getEpisodes(req, res) {
    const filmSlug = req.query.film
    const seasonSlug = req.query.season

    // Kiểm tra xem filmSlug và seasonSlug có tồn tại và không null
    if (!filmSlug || !seasonSlug) {
      return res
        .status(400)
        .send('Slug của Film và Season không được để trống.')
    }

    try {
      // Tìm Film dựa vào slug của Film
      const film = await Film.findOne({ slug: filmSlug }).exec()

      if (!film) {
        return res.status(404).send('Không tìm thấy Film với slug tương ứng.')
      }

      // Tìm Season dựa vào slug của Season và film_id của Film
      const season = await Season.findOne({
        slug: seasonSlug,
        film_id: film.id
      }).exec()

      if (!season) {
        return res
          .status(404)
          .send('Không tìm thấy Season với slug tương ứng và Film tương ứng.')
      }

      // Tìm các Episode liên quan đến Season
      const episodes = await Episode.find({
        season_id: season.id,
        film_id: film.id
      }).sort({ slug: 1 }).exec();

      // Trả về danh sách Episode
      res.send(episodes)
    } catch (err) {
      console.error('Lỗi khi lấy dữ liệu Episode:', err)
      res.status(500).send('Lỗi khi lấy dữ liệu Episode')
    }
  }
}

module.exports = new EpisodeController()

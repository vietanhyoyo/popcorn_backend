const Season = require('../models/Season')
const Film = require('../models/Film')

class SeasonController {
  async getSeasons(req, res) {
    const filmSlug = req.query.film

    // Kiểm tra xem filmSlug và seasonSlug có tồn tại và không null
    if (!filmSlug) {
      return res
        .status(400)
        .send('Slug của Film không được để trống.')
    }

    try {
      // Tìm Film dựa vào slug của Film
      const film = await Film.findOne({ slug: filmSlug }).exec()

      if (!film) {
        return res.status(404).send('Không tìm thấy Film với slug tương ứng.')
      }

      // Tìm các Season liên quan đến Film
      const seasons = await Season.find({ film_id: film.id }).sort({ slug: 1 }).exec();

      // Trả về danh sách Season
      res.send(seasons)
    } catch (err) {
      console.error('Lỗi khi lấy dữ liệu Season:', err)
      res.status(500).send('Lỗi khi lấy dữ liệu Season')
    }
  }
}

module.exports = new SeasonController()

const Season = require('../models/Season')
const Film = require('../models/Film')
const Episode = require('../models/Episode')
const episodeController = require('./EpisodeController')

class SeasonController {
  async getSeasons(req, res) {
    const filmSlug = req.query.film

    // Kiểm tra xem filmSlug và seasonSlug có tồn tại và không null
    if (!filmSlug) {
      return res.status(400).send('Slug của Film không được để trống.')
    }

    try {
      // Tìm Film dựa vào slug của Film
      const film = await Film.findOne({ slug: filmSlug }).exec()

      if (!film) {
        return res.status(404).send('Không tìm thấy Film với slug tương ứng.')
      }

      // Tìm các Season liên quan đến Film
      const seasons = await Season.find({ film_id: film.id })
        .sort({ slug: 1 })
        .exec()

      // Trả về danh sách Season
      res.send(seasons)
    } catch (err) {
      console.error('Lỗi khi lấy dữ liệu Season:', err)
      res.status(500).send('Lỗi khi lấy dữ liệu Season')
    }
  }

  async updateSeason(req, res) {
    const seasonId = req.params.id // Lấy ID của Season từ URL
    const updatedSeasonData = req.body // Dữ liệu cập nhật từ request body

    try {
      // Tìm Season dựa vào ID
      const season = await Season.findById(seasonId)

      if (!season) {
        return res.status(404).json({ message: 'Không tìm thấy Season' })
      }

      // Cập nhật thông tin của Season với dữ liệu mới
      Object.assign(season, updatedSeasonData)

      // Lưu Season đã cập nhật vào cơ sở dữ liệu
      const updatedSeason = await season.save()

      res.json(updatedSeason)
    } catch (error) {
      console.error('Lỗi khi cập nhật Season:', error)
      res.status(500).json({ message: 'Lỗi khi cập nhật Season' })
    }
  }

  async addSeason(req, res) {
    const seasonData = req.body // Dữ liệu Season từ request body

    try {
      // Sắp xếp các bản ghi theo trường id giảm dần và lấy ra bản ghi có id lớn nhất
      const maxIdSeason = await Season.findOne().sort({ id: -1 })

      let newIdSeason = 1 // Giá trị ID mặc định nếu không có bản ghi nào trong cơ sở dữ liệu

      if (maxIdSeason) {
        newIdSeason = maxIdSeason.id + 1
      }

      const newSeasonData = {
        ...seasonData,
        id: newIdSeason
      }

      // Tạo một Season mới bằng dữ liệu từ request
      const newSeason = new Season(newSeasonData)

      // Lưu Season mới vào cơ sở dữ liệu
      const savedSeason = await newSeason.save()

      res.status(201).json(savedSeason) // Trả về thông tin Season đã thêm
    } catch (error) {
      console.error('Lỗi khi thêm Season:', error)
      res.status(500).json({ message: 'Lỗi khi thêm Season' })
    }
  }

  async deleteSeason(req, res) {
    const seasonId = req.params.id // Lấy ID của Season từ URL

    try {
      const result = await new SeasonController().deleteSeasonClean(seasonId)

      if (result.error) {
        res.status(500).json({ message: result.message })
        return
      }

      res.json({ message: 'Season và các Episode đã được xóa thành công' })
    } catch (error) {
      res.status(500).json({ message: 'Lỗi khi xóa Season và các Episode' })
    }
  }

  async deleteSeasonClean(season_id) {
    // Tìm Season dựa vào ID
    const season = await Season.findById(season_id)
    if (!season) {
      return { message: 'Không tìm thấy Season', error: true }
    }

    // Xóa các Episode có season_id tương ứng với ID của Season
    const episodes = await Episode.find({ season_id: season.id })
    for (var epi of episodes) {
      const result = await episodeController.deleteEpisodeAndSoundTrack(epi._id)
      if (result.error) {
        return { message: result.message, error: true }
      }
    }

    // Xóa Season khỏi cơ sở dữ liệu
    await season.remove()

    return { message: 'Xóa season thành công!', error: false }
  }
}

module.exports = new SeasonController()

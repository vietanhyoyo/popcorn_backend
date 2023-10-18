const Season = require('../models/Season')
const Episode = require('../models/Episode')
const SoundTrack = require('../models/SoundTrack')
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
      })
        .sort({ slug: 1 })
        .exec()

      // Loop through the episodes and count the associated soundtracks
      for (let i = 0; i < episodes.length; i++) {
        const soundtrackCount = await SoundTrack.countDocuments({
          episode_id: episodes[i].id,
          film_id: film.id
        })
        episodes[i] = {
          ...episodes[i].toObject(),
          soundtrack_count: soundtrackCount
        } // Add the count to the episode object
      }

      // Trả về danh sách Episode
      res.send(episodes)
    } catch (err) {
      console.error('Lỗi khi lấy dữ liệu Episode:', err)
      res.status(500).send('Lỗi khi lấy dữ liệu Episode')
    }
  }

  async updateEpisode(req, res) {
    const episodeId = req.params.id // Lấy ID của Episode từ URL
    const updatedEpisodeData = req.body // Dữ liệu cập nhật từ request body

    try {
      // Tìm Episode dựa vào ID
      const episode = await Episode.findById(episodeId)

      if (!episode) {
        return res.status(404).json({ message: 'Không tìm thấy Episode' })
      }

      // Cập nhật thông tin của Episode với dữ liệu mới
      Object.assign(episode, updatedEpisodeData)

      // Lưu Episode đã cập nhật vào cơ sở dữ liệu
      const updatedEpisode = await episode.save()

      res.json(updatedEpisode)
    } catch (error) {
      console.error('Lỗi khi cập nhật Episode:', error)
      res.status(500).json({ message: 'Lỗi khi cập nhật Episode' })
    }
  }

  async addEpisode(req, res) {
    const episodeData = req.body // Dữ liệu Episode từ request body

    try {
      // Sắp xếp các bản ghi theo trường id giảm dần và lấy ra bản ghi có id lớn nhất
      const maxIdEpisode = await Episode.findOne().sort({ id: -1 })

      let newIdEpisode = 1 // Giá trị ID mặc định nếu không có bản ghi nào trong cơ sở dữ liệu

      if (maxIdEpisode) {
        newIdEpisode = maxIdEpisode.id + 1
      }

      const newEpisodeData = {
        ...episodeData,
        id: newIdEpisode
      }

      // Tạo một Episode mới bằng dữ liệu từ request
      const newEpisode = new Episode(newEpisodeData)

      // Lưu Episode mới vào cơ sở dữ liệu
      const savedEpisode = await newEpisode.save()

      res.status(201).json(savedEpisode) // Trả về thông tin Episode đã thêm
    } catch (error) {
      console.error('Lỗi khi thêm Episode:', error)
      res.status(500).json({ message: 'Lỗi khi thêm Episode' })
    }
  }

  async deleteEpisode(req, res) {
    const episodeId = req.params.id // Lấy ID của Episode từ URL

    try {
      // xóa episode và soundtrack liên quan
      await new EpisodeController().deleteEpisodeAndSoundTrack(episodeId)

      res.json({ message: 'Episode và các SoundTrack đã được xóa thành công' })
    } catch (error) {
      console.error('Lỗi khi xóa Episode và các SoundTrack:', error)
      res.status(500).json({ message: 'Lỗi khi xóa Episode và các SoundTrack' })
    }
  }

  async deleteEpisodeAndSoundTrack(episode_id) {
    // Tìm Episode dựa vào ID
    const episode = await Episode.findById(episode_id)

    if (!episode) {
      return { message: 'Không tìm thấy Episode', error: true }
    }

    // Xóa các SoundTrack có episode_id tương ứng với ID của Episode
    await SoundTrack.deleteMany({ episode_id: episode.id })

    // Xóa Episode khỏi cơ sở dữ liệu
    await episode.remove()

    return { message: 'Đã xóa episode và soundtrackc', error: false }
  }
}

module.exports = new EpisodeController()

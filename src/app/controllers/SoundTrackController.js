const SoundTrack = require('../models/SoundTrack')
const Film = require('../models/Film')
const Episode = require('../models/Episode')

class SoundTrackController {
  async getSoundTracks(req, res) {
    const filmSlug = req.query.film
    const episodeSlug = req.query.episode

    try {
      let soundTracks

      if (filmSlug) {
        // Tìm Film dựa vào slug của Film
        const film = await Film.findOne({ slug: filmSlug }).exec()

        if (!film) {
          return res.status(404).send('Không tìm thấy Film với slug tương ứng.')
        }

        if (episodeSlug) {
          // Tìm Episode dựa vào slug của Episode
          const episode = await Episode.findOne({ slug: episodeSlug }).exec()

          if (!episode) {
            return res
              .status(404)
              .send('Không tìm thấy Episode với slug tương ứng.')
          }

          // Sử dụng thông tin Film và Episode để tìm các SoundTrack
          soundTracks = await SoundTrack.find({
            film_id: film.id,
            episode_id: episode.id
          }).exec()
        } else {
          // Nếu chỉ có slug của Film, tìm các SoundTrack dựa vào film_id
          soundTracks = await SoundTrack.find({ film_id: film.id }).exec()
        }
      } else {
        return res.status(400).send('Thiếu tham số query "film".')
      }

      // Trả về danh sách SoundTrack
      res.send(soundTracks)
    } catch (err) {
      console.error('Lỗi khi lấy dữ liệu SoundTrack:', err)
      res.status(500).send('Lỗi khi lấy dữ liệu SoundTrack')
    }
  }

  async updateSoundTrackById(req, res) {
    const soundtrackId = req.params.id; // Lấy ID của soundtrack từ URL
    const updatedSoundtrackData = req.body; // Dữ liệu cập nhật từ request body
  
    try {
      // Tìm soundtrack dựa vào ID
      const soundtrack = await SoundTrack.findById(soundtrackId);
  
      if (!soundtrack) {
        return res.status(404).json({ message: 'Không tìm thấy soundtrack' });
      }
  
      // Cập nhật thông tin của soundtrack với dữ liệu mới
      Object.assign(soundtrack, updatedSoundtrackData);
  
      // Lưu soundtrack đã cập nhật vào cơ sở dữ liệu
      const updatedSoundtrack = await soundtrack.save();
  
      res.json(updatedSoundtrack);
    } catch (error) {
      console.error('Lỗi khi cập nhật soundtrack:', error);
      res.status(500).json({ message: 'Lỗi khi cập nhật soundtrack' });
    }
  }
}

module.exports = new SoundTrackController()

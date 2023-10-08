const Type = require('../../models/Type')
const Film = require('../../models/Film')
const Episode = require('../../models/Episode')
const Season = require('../../models/Season')
const SoundTrack = require('../../models/SoundTrack')
const { pool } = require('../../../config/db/mysql')

class ConvertController {
  convertType(req, res) {
    pool.query('select * from type', async (err, result, fields) => {
      if (err) {
        return res.status(500).json({ error: err.message })
      }

      try {
        const insertPromises = result.map(async (item) => {
          const newItem = { id: item.id.toString(), name: item.name }
          // Sử dụng async/await để chờ việc lưu vào MongoDB hoàn thành
          return Type.create(newItem)
        })

        // Sử dụng Promise.all để chờ tất cả các lời hứa lưu vào MongoDB hoàn thành
        await Promise.all(insertPromises)

        // Trả về thông tin Type đã được lưu
        res.status(201).json({ message: 'success' })
      } catch (error) {
        // Xử lý lỗi nếu có
        console.log(error)
        res.status(500).json({ error, message: 'create error' })
      }
    })
  }

  convertFilm(req, res) {
    pool.query('select * from playlists', async (err, result, fields) => {
      if (err) {
        return res.status(500).json({ error: err.message })
      }

      try {
        const insertPromises = result.map(async (item) => {

          const newItem = {
            id: item.id.toString(),
            name: item.name,
            slug: item.slug,
            thumbnail: item.thumbnail,
            backdrop: item.backdrop,
            type: item.type,
            releaseDate: item.release_date,
            is_banner: item.isBanner.readUInt8(0),
            is_recent: item.isRecent.readUInt8(0),
            is_new: item.isNew.readUInt8(0),
            is_popular: item.isPopular.readUInt8(0),
            path: item.path,
            themoviedb_id: item.themoivedb_id,
            description: item.description
          }
          // Sử dụng async/await để chờ việc lưu vào MongoDB hoàn thành
          return Film.create(newItem)
        })

        // Sử dụng Promise.all để chờ tất cả các lời hứa lưu vào MongoDB hoàn thành
        await Promise.all(insertPromises)

        // Trả về thông báo
        res.status(201).json({ message: 'success' })
      } catch (error) {
        // Xử lý lỗi nếu có
        console.log(error)
        res.status(500).json({ error, message: 'create error' })
      }
    })
  }

  convertEpisode(req, res) {
    pool.query('select * from episodes', async (err, result, fields) => {
      if (err) {
        return res.status(500).json({ error: err.message })
      }

      try {
        const insertPromises = result.map(async (item) => {

          const newItem = {
            id: item.id.toString(),
            name: item.name,
            slug: item.slug,
            description: item.description,
            release_date: item.release_date,
            season_id: item.season_id.toString(),
            code: item.code,
          }
          // Sử dụng async/await để chờ việc lưu vào MongoDB hoàn thành
          return Episode.create(newItem)
        })

        // Sử dụng Promise.all để chờ tất cả các lời hứa lưu vào MongoDB hoàn thành
        await Promise.all(insertPromises)

        // Trả về thông báo
        res.status(201).json({ message: 'success' })
      } catch (error) {
        // Xử lý lỗi nếu có
        console.log(error)
        res.status(500).json({ error, message: 'create error' })
      }
    })
  }

  convertSeason(req, res) {
    pool.query('select * from seasons', async (err, result, fields) => {
      if (err) {
        return res.status(500).json({ error: err.message })
      }

      try {
        const insertPromises = result.map(async (item) => {

          const newItem = {
            id: item.id.toString(),
            name: item.name,
            slug: item.slug,
            film_id: item.playlist_id.toString(),
            release_date: item.release_date,
          }
          // Sử dụng async/await để chờ việc lưu vào MongoDB hoàn thành
          return Season.create(newItem)
        })

        // Sử dụng Promise.all để chờ tất cả các lời hứa lưu vào MongoDB hoàn thành
        await Promise.all(insertPromises)

        // Trả về thông báo
        res.status(201).json({ message: 'success' })
      } catch (error) {
        // Xử lý lỗi nếu có
        console.log(error)
        res.status(500).json({ error, message: 'create error' })
      }
    })
  }

  convertSoundTrack(req, res) {
    pool.query('select * from soundtrack', async (err, result, fields) => {
      if (err) {
        return res.status(500).json({ error: err.message })
      }

      try {
        const insertPromises = result.map(async (item) => {

          const newItem = {
            id: item.id.toString(),
            name: item.name,
            slug: item.slug,
            episode_id: item.episodes_id != null ? item.episodes_id.toString() : item.episodes_id,
            description: item.description,
            artist: item.artist,
            itune_link: item.itune_link,
            amazon_link: item.amazon_link,
            apple_link: item.apple_link,
            spotify_link: item.spotify_link,
            youtube_link: item.youtube_link,
            film_id: item.playlist_id.toString(),
            is_play: item.isPlay.readUInt8(0),
            sort: item.sort
          }
          // Sử dụng async/await để chờ việc lưu vào MongoDB hoàn thành
          return SoundTrack.create(newItem)
        })

        // Sử dụng Promise.all để chờ tất cả các lời hứa lưu vào MongoDB hoàn thành
        await Promise.all(insertPromises)

        // Trả về thông báo
        res.status(201).json({ message: 'success' })
      } catch (error) {
        // Xử lý lỗi nếu có
        console.log(error)
        res.status(500).json({ error, message: 'create error' })
      }
    })
  }
}

module.exports = new ConvertController()

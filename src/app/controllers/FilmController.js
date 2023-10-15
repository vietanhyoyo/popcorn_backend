const Film = require('../models/Film')
const SoundTrack = require('../models/SoundTrack')
const Season = require('../models/Season')
const seasonController = require('./SeasonController')

perPage = 20 // Số lượng mục trên mỗi trang

class FilmController {
  async getFilmList(req, res) {
    const searchTerm = req.query.name
    const typeFilter = req.query.type
    // Mặc định, nếu không có giá trị cho 'page' thì sẽ sử dụng trang 1
    const page = parseInt(req.query.page) || 1

    try {
      const filter = {
        type: { $ne: 3 }
      }

      // Nếu giá trị 'type' được cung cấp, thêm điều kiện lọc
      if (typeFilter && typeFilter != '') {
        filter.type = typeFilter
      }
      // Tính toán tổng số dữ liệu
      var totalDataCount
      if (searchTerm && searchTerm != '') {
        totalDataCount = await Film.countDocuments({
          name: { $regex: searchTerm, $options: 'i' },
          ...filter
        })
      } else {
        totalDataCount = await Film.countDocuments(filter)
      }

      // Tính toán tổng số trang
      const totalPages = Math.ceil(totalDataCount / perPage)

      // Xác định trang trước và trang tiếp theo
      const prevPage = page > 1 ? page - 1 : null
      const nextPage = page < totalPages ? page + 1 : null

      var films
      if (searchTerm && searchTerm != '') {
        films = await Film.find({
          name: {
            $regex: searchTerm,
            $options: 'i'
          },
          ...filter
        })
      } else {
        films = await Film.find(filter)
          .skip((page - 1) * perPage)
          .limit(perPage)
      }

      // Tạo một mảng các Promise để lấy số lượng soundtrack cho mỗi bộ phim
      const soundtrackCountsPromises = films.map(async (film) => {
        const soundtrackCount = await SoundTrack.countDocuments({
          film_id: film.id
        })
        return {
          film_id: film.id,
          soundtrack_count: soundtrackCount
        }
      })

      // Chờ tất cả các Promise hoàn thành
      const soundtrackCounts = await Promise.all(soundtrackCountsPromises)

      // Thêm số lượng soundtrack vào thông tin của từng bộ phim
      const filmsWithSoundtrackCount = films.map((film) => {
        const matchingSoundtrackCount = soundtrackCounts.find(
          (item) => item.film_id === film.id
        )
        return {
          ...film.toObject(),
          soundtrack_count: matchingSoundtrackCount
            ? matchingSoundtrackCount.soundtrack_count
            : 0
        }
      })

      // Trả về thông tin về trang và dữ liệu
      res.send({
        current_page: page,
        total_pages: totalPages,
        total: totalDataCount,
        prev_page: prevPage,
        next_page: nextPage,
        per_page: perPage,
        data: filmsWithSoundtrackCount
      })
    } catch (err) {
      console.error('Lỗi khi truy vấn dữ liệu:', err)
      res.status(500).send('Lỗi khi truy vấn dữ liệu')
    }
  }

  async getFilmBySlug(req, res) {
    const slug = req.query.slug

    if (!slug) {
      return res.status(400).send('Slug không được bỏ trống')
    }

    try {
      const film = await Film.findOne({ slug: slug }).exec()

      if (!film) {
        return res.status(404).send('Không tìm thấy bộ phim với slug tương ứng')
      }

      // Trả về thông tin của bộ phim
      res.send(film)
    } catch (err) {
      console.error('Lỗi khi tìm kiếm bộ phim:', err)
      res.status(500).send('Lỗi khi truy vấn dữ liệu')
    }
  }

  async getFilmByID(req, res) {
    const id = req.query.id

    if (!id) {
      return res.status(400).send('Id không được bỏ trống')
    }

    try {
      const film = await Film.findById(id).exec()

      if (!film) {
        return res.status(404).send('Không tìm thấy bộ phim với slug tương ứng')
      }

      // Trả về thông tin của bộ phim
      res.send(film)
    } catch (err) {
      console.error('Lỗi khi tìm kiếm bộ phim:', err)
      res.status(500).send('Lỗi khi truy vấn dữ liệu')
    }
  }

  async updateFilm(req, res) {
    const filmId = req.params.id // Lấy ID của bộ phim từ URL
    const updatedFilmData = req.body // Dữ liệu cập nhật từ request body

    try {
      console.log(filmId), console.log(updatedFilmData)

      // Tìm bộ phim dựa vào ID
      const film = await Film.findById(filmId)

      if (!film) {
        return res.status(404).json({ message: 'Không tìm thấy bộ phim' })
      }

      // Cập nhật thông tin của bộ phim với dữ liệu mới
      Object.assign(film, updatedFilmData)

      // Lưu bộ phim đã cập nhật vào cơ sở dữ liệu
      const updatedFilm = await film.save()

      res.json(updatedFilm)
    } catch (error) {
      console.error('Lỗi khi cập nhật bộ phim:', error)
      res.status(500).json({ message: 'Lỗi khi cập nhật bộ phim' })
    }
  }

  async getSearchFilm(req, res) {
    const searchTerm = req.query.name
    // Mặc định, nếu không có giá trị cho 'page' thì sẽ sử dụng trang 1
    const page = parseInt(req.query.page) || 1

    try {
      // Tính toán tổng số dữ liệu
      const totalDataCount = await Film.countDocuments({})

      // Tính toán tổng số trang
      const totalPages = Math.ceil(totalDataCount / perPage)

      // Xác định trang trước và trang tiếp theo
      const prevPage = page > 1 ? page - 1 : null
      const nextPage = page < totalPages ? page + 1 : null

      // Truy vấn dữ liệu cho trang hiện tại
      const films = await Film.find({
        name: { $regex: searchTerm, $options: 'i' }
      })
        .skip((page - 1) * perPage)
        .limit(perPage)

      // Tạo một mảng các Promise để lấy số lượng soundtrack cho mỗi bộ phim
      const soundtrackCountsPromises = films.map(async (film) => {
        const soundtrackCount = await SoundTrack.countDocuments({
          film_id: film.id
        })
        return {
          film_id: film.id,
          soundtrack_count: soundtrackCount
        }
      })

      // Chờ tất cả các Promise hoàn thành
      const soundtrackCounts = await Promise.all(soundtrackCountsPromises)

      // Thêm số lượng soundtrack vào thông tin của từng bộ phim
      const filmsWithSoundtrackCount = films.map((film) => {
        const matchingSoundtrackCount = soundtrackCounts.find(
          (item) => item.film_id === film.id
        )
        return {
          ...film.toObject(),
          soundtrack_count: matchingSoundtrackCount
            ? matchingSoundtrackCount.soundtrack_count
            : 0
        }
      })

      // Trả về thông tin về trang và dữ liệu
      res.send({
        current_page: page,
        total_pages: totalPages,
        total: totalDataCount,
        prev_page: prevPage,
        next_page: nextPage,
        per_page: perPage,
        data: filmsWithSoundtrackCount
      })
    } catch (err) {
      console.error('Lỗi khi truy vấn dữ liệu:', err)
      res.status(500).send('Lỗi khi truy vấn dữ liệu')
    }
  }

  async addFilm(req, res) {
    const filmData = req.body // Dữ liệu bộ phim từ request body

    try {
      // Sắp xếp các bản ghi theo trường id giảm dần và lấy ra bản ghi có id lớn nhất
      var filmWithMaxId = await Film.findOne().sort({ id: -1 })

      if (!filmWithMaxId) {
        filmWithMaxId = 0
      } else {
        filmWithMaxId = filmWithMaxId.id + 1
      }

      const addData = { ...filmData, id: filmWithMaxId }
      // Tạo một bộ phim mới bằng dữ liệu từ request
      const newFilm = new Film(addData)

      // Lưu bộ phim mới vào cơ sở dữ liệu
      const savedFilm = await newFilm.save()

      res.status(201).json(savedFilm) // Trả về thông tin bộ phim đã thêm
    } catch (error) {
      console.error('Lỗi khi thêm bộ phim:', error)
      res.status(500).json({ message: 'Lỗi khi thêm bộ phim' })
    }
  }

  async deleteFilm(req, res) {
    const filmId = req.params.id // Lấy ID từ URL

    try {
      // Tìm Film dựa vào ID
      const film = await Film.findById(filmId)

      if (!film) {
        return res.status(404).json({ message: 'Không tìm thấy Film' })
      }

      if (film.type == 1) {
        const seasons = await Season.find({ film_id: film.id })
        for (var sea of seasons) {
          const result = await seasonController.deleteSeasonClean(sea._id)
          if (result.error) {
            res.status(500).json({ message: result.message })
            return
          }
        }
      }

      // Xóa Film khỏi cơ sở dữ liệu
      await film.remove()

      res.json({ message: 'Film đã được xóa thành công' })
    } catch (error) {
      console.error('Lỗi khi xóa Film:', error)
      res.status(500).json({ message: 'Lỗi khi xóa Film' })
    }
  }
}

module.exports = new FilmController()

const Film = require('../models/Film')

perPage = 16 // Số lượng mục trên mỗi trang

class FilmController {
  async getFilmList(req, res) {
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
      const data = await Film.find({})
        .skip((page - 1) * perPage)
        .limit(perPage)

      // Trả về thông tin về trang và dữ liệu
      res.send({
        current_page: page,
        total_pages: totalPages,
        total: totalDataCount,
        prev_page: prevPage,
        next_page: nextPage,
        per_page: perPage,
        data: data
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
}

module.exports = new FilmController()

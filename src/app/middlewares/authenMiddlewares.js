// Import thư viện JWT (JSON Web Token) để sử dụng trong xác thực
const jwt = require('jsonwebtoken')

// Middleware xác thực người dùng
function authenMiddleware(req, res, next) {
  // Lấy thông tin xác thực từ tiêu đề "Authorization" của yêu cầu
  const authorization = req.headers['authorization']

  // Kiểm tra nếu không có thông tin xác thực, trả về mã trạng thái 401 (Unauthorized)
  if (!authorization) res.sendStatus(401)

  // Xác định token từ thông tin xác thực, thông thường sẽ có định dạng "Bearer [token]"
  const token = authorization.split(' ')[1]

  // Kiểm tra nếu không tìm thấy token, trả về mã trạng thái 401 (Unauthorized)
  if (!token) res.sendStatus(401)
  else {
    // Sử dụng mã thông báo và mã bí mật (SECRET) để xác thực token
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, data) => {
      // Nếu có lỗi trong quá trình xác thực token, trả về mã trạng thái 403 (Forbidden)
      if (err) res.sendStatus(403)
      else {
        // Nếu token hợp lệ, chuyển tiếp yêu cầu tới middleware tiếp theo hoặc xử lý tiếp theo
        next()
      }
    })
  }
}

// Xuất middleware để có thể sử dụng ở những nơi khác trong ứng dụng
module.exports = authenMiddleware

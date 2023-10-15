// Import thư viện JWT (JSON Web Token) để sử dụng trong xác thực
const jwt = require('jsonwebtoken')

// Middleware xác thực người dùng
function authenMiddleware(req, res, next) {
  
}

// Xuất middleware để có thể sử dụng ở những nơi khác trong ứng dụng
module.exports = authenMiddleware

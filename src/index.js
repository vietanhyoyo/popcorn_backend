// Import các module cần thiết
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const http = require('http')
const { Server } = require('socket.io')
const dotenv = require('dotenv')

// Khởi tạo ứng dụng Express
const app = express()

// Sử dụng middleware CORS để cho phép truy cập từ các nguồn khác nhau
app.use(cors())

// Sử dụng Morgan để ghi lại các sự kiện trên trình duyệt
app.use(morgan('combined'))

// Sử dụng JSON middleware cho phân tích cú pháp JSON
app.use(express.json())

// Đọc các biến môi trường từ tệp .env
dotenv.config()

// Thiết lập cổng máy chủ hoặc sử dụng cổng mặc định là 5000
const PORT = process.env.PORT || 5000

// Khai báo route
const route = require('./routes')
route(app)

//Dung csdl
const db = require('./config/db/mongodb')
db.connect()

// Tạo máy chủ HTTP và kết nối với Express
const server = http.createServer(app)

// Khởi tạo máy chủ Socket.io và kết nối nó với máy chủ HTTP
const io = new Server(server)
const socket = require('./socket')
socket(io)

// Lắng nghe kết nối đến cổng đã chỉ định
server.listen(PORT, () => {
  console.log(`App listening at http://localhost:${PORT}`)
})

//    ****     ****
//  *******   *******
// ********* *********
// *******************
//  *****************
//    *************
//      *********
//         ***

//    ** 26 / 4 **    //

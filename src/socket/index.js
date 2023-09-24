const exampleListen = require('./exampleListen.socket')

function socket(io) {
    /**io lắng nghe khi có connect đến */
    io.on('connection', (socket) => {
        console.log('----------- Đã kết nối socket ----------------------');
        exampleListen(socket, io)
    })
}

module.exports = socket;
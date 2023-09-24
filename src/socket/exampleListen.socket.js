function exampleListen(socket, io) {

    socket.on('listen-message', data => {
    
        io.emit('listen-message', { message: "data" });

    })

}

module.exports = exampleListen
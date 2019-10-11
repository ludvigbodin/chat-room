const io = require('socket.io')(3000);

const users = {};

io.on("connection", socket => {

    socket.on('new-user', name => {
        users[socket.id] = name;
        const connectedUsers = Object.values(users);

        const data = {
            user: name,
            connectedUsers: connectedUsers
        }

        socket.broadcast.emit('user-connected', data)
        socket.emit("yes", connectedUsers)
    })

    socket.on('send-chat-message', message => {
        socket.broadcast.emit('chat-message', {message: message, name: users[socket.id]})
    })

    socket.on('disconnect', () => {
        const data = {
            user: users[socket.id]
        }
        delete users[socket.id]
        data.users = Object.values(users);
        socket.broadcast.emit('user-disconnected', data)
    })
    
})

const io = require('socket.io')(5000, {
    path: "/socket2/socket.io",
    cors: {
        origin: "http://relier.tk",
    },
})

let onlineUsers = [];

const addNewUser = (username, socketId) => {
    !onlineUsers.some((user) => user.username === username) &&
        onlineUsers.push({ username, socketId })
}

const removeUser = (socketId) => {
    onlineUsers = onlineUsers.filter(user => user.socketId !== socketId)
}

const getUser = (username) => {
    return onlineUsers.find((user) => user.username === username)
}

io.on("connection", (socket) => {
    console.log("someone has connected");
    socket.on("newUser", (username) => {
        addNewUser(username.id, socket.id)
    })

    socket.on("sendNotification", ({ senderName, receiverName,postId,type }) => {
        const receiver = getUser(receiverName)
        console.log();
        io.to(receiver?.socketId).emit("getNotification", {
            senderName,
            postId,
            type
        })
    })

    socket.on("sendMessageNotification", ({ senderName, receiverName,type }) => {
        const receiver = getUser(receiverName)
        console.log();
        io.to(receiver?.socketId).emit("getMessageNotification", {
            senderName,
            type
        })
    })

    socket.on("disconnect", () => {
        console.log("someone has left");
        removeUser(socket.id)
    })
});

io.listen(5000);
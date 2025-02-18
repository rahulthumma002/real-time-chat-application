const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const users = {};
const rooms = ["General"]; // Default room

app.use(express.static("public"));

io.on("connection", (socket) => {
    console.log("A user connected");

    socket.on("joinRoom", ({ username, room }) => {
        if (!users[socket.id]) {
            users[socket.id] = { username, room };
            socket.join(room);
            io.to(room).emit("message", { username: "System", text: `${username} has joined ${room}` });
        }
    });

    socket.on("chatMessage", (msg) => {
        const user = users[socket.id];
        if (user) {
            io.to(user.room).emit("message", { username: user.username, text: msg, time: new Date().toLocaleTimeString() });
        }
    });

    socket.on("disconnect", () => {
        const user = users[socket.id];
        if (user) {
            io.to(user.room).emit("message", { username: "System", text: `${user.username} has left the chat` });
            delete users[socket.id];
        }
    });

    socket.on("createRoom", (room) => {
        if (!rooms.includes(room)) {
            rooms.push(room);
            io.emit("updateRooms", rooms);
        }
    });
});

server.listen(3000, () => console.log("Server running on port 3000"));

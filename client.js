const socket = io();
let username = prompt("Enter your username:");
let currentRoom = "General";

function updateRoomList(rooms) {
    const roomList = document.getElementById("room-list");
    roomList.innerHTML = "";
    rooms.forEach(room => {
        const li = document.createElement("li");
        li.textContent = room;
        li.onclick = () => joinRoom(room);
        roomList.appendChild(li);
    });
}

function joinRoom(room) {
    currentRoom = room;
    document.getElementById("messages").innerHTML = "";
    socket.emit("joinRoom", { username, room });
}

function createRoom() {
    const roomName = document.getElementById("new-room").value;
    if (roomName) {
        socket.emit("createRoom", roomName);
        document.getElementById("new-room").value = "";
    }
}

function sendMessage() {
    const messageInput = document.getElementById("message-input");
    const message = messageInput.value.trim();
    if (message) {
        socket.emit("chatMessage", message);
        messageInput.value = "";
    }
}

socket.on("message", (msg) => {
    const messagesDiv = document.getElementById("messages");
    const messageElement = document.createElement("div");
    messageElement.innerHTML = `<strong>${msg.username}</strong>: ${msg.text} <small>${msg.time || ""}</small>`;
    messagesDiv.appendChild(messageElement);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
});

socket.on("updateRooms", (rooms) => {
    updateRoomList(rooms);
});

socket.emit("joinRoom", { username, room: currentRoom });

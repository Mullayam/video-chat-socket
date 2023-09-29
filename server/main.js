const express = require("express");
const bodyParser = require("body-parser");
const { io } = require("./services/socket");
const cors = require("cors");
const app = express();
app.use(bodyParser.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    allowedHeaders: {
      "Access-Control-Allow-Origin": "http://localhost:3000",
    },
  })
);
const UserArrayMapp = new Map();
const SocketToEmail = new Map();

io.on("connection", (socket) => {
  console.log("Socket connected");
  socket.on("join-room", (data) => {
    const { roomId, username } = data;
    UserArrayMapp.set(username, socket.id);
    SocketToEmail.set(socket.id, username);
    socket.join(roomId);
    socket.emit("joined-room", roomId);
    socket.broadcast.to(roomId).emit("user-joined", { username });
  });
  socket.on("call-user", (data) => {
    const { username, newOffer } = data;
    const CallFromUser = SocketToEmail.get(socket.id);
    const socketId = UserArrayMapp.get(username);
    socket.to(socketId).emit("incoming-call", {
      from: CallFromUser,
      offer: newOffer,
    });
  });

  socket.on("call-accepted", (data) => {
    const { username, ans } = data;
    const socketId = UserArrayMapp.get(username);
    
    socket.to(socketId).emit("call-accepted", {
      ans,
    });
  });
});

// Runnening Server
app.listen(5123, () => console.log("App Service on port 5123"));
io.listen(5124, () => console.log("Signalling Service on port 5124"));

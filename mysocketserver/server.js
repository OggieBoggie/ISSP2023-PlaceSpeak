const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const pollsNamespace = io.of("/polls");

pollsNamespace.on("connection", (socket) => {
  console.log("User connected to polls namespace.");

  socket.on("createPoll", () => {
    // When a poll is created, notify all clients to fetch latest polls
    pollsNamespace.emit("newPoll");
  });
});

server.listen(4000, () => {
  console.log("Socket.io server listening on port 4000");
});

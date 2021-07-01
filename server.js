const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const http = require("http").createServer(app);
app.use(express.static(__dirname + "/public"));
app.get("/", (req, res) => {
  res.sendFile("index.html");
});
http.listen(PORT, () => {
  console.log(`Listening to port ${PORT}`);
});
const users = {};
const io = require("socket.io")(http);
io.on("connection", (socket) => {
  socket.on("new_user_joined", (name) => {
    users[socket.id] = name;
    //Let other users know that a new user has joined
    socket.broadcast.emit("user_joined", name);
  });
  socket.on("send_message", (data, time) => {
    socket.broadcast.emit("receive_message", data, time);
  });
  //Check if user disconnects and let others know
  socket.on("disconnect", () => {
    socket.broadcast.emit("user_left", users[socket.id]);
    delete users[socket.id];
  });
});

const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const http = require("http");
http.createServer(app);
const io = require("socket.io")(http);
app.use(express.static(__dirname + "/public"));
app.get("/", (req, res) => {
  res.sendFile("index.html");
});
app.listen(PORT, () => {
  console.log(`Listening to port ${PORT}`);
});
io.on("connection", (socket) => {
  socket.emit("new_user_joined", "Pratik");
});

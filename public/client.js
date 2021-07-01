const socket = io();
socket.on("new_user_joined", (name) => {
  console.log(`${name} joined`);
});

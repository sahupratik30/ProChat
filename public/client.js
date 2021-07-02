const socket = io();
//Current time stamp
let d;
let time;
let hours;
let minutes;
//DOM Elements
const inputMessage = document.getElementById("input");
const send = document.getElementById("send_btn");
const messageArea = document.querySelector(".message_area");
let user_name;
do {
  let name = prompt("Please enter your name:");
  user_name = name;
} while (!user_name);
let typedMessage;
inputMessage.addEventListener("input", (e) => {
  typedMessage = e.target.value.trim();
});
send.addEventListener("click", () => {
  if (typedMessage === undefined || typedMessage === "") {
    alert("Please type a message");
  } else {
    sendMessage(typedMessage);
  }
});
//Function to update time
function updateTime() {
  d = new Date();
  hours = d.getHours();
  minutes = d.getMinutes();
  let meridian = hours === 12 ? "PM" : "AM";
  if (hours > 12) {
    meridian = "PM";
    if (hours - 12 < 10) {
      hours = `0${hours - 12}`;
    } else {
      hours = `${hours - 12}`;
    }
  } else if (hours < 10) {
    hours = `0${hours}`;
  }
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  time =
    hours > 12
      ? `${hours}:${minutes} ${meridian}`
      : `${hours}:${minutes} ${meridian}`;
}
//Function to send message
function sendMessage(message) {
  updateTime();
  let msg = {
    user: user_name.trim(),
    message: message,
  };
  //Append message to DOM
  appendMessage(msg, "outgoing", time);
  scrollToBottom();
  //Clear the input field
  inputMessage.value = "";
  typedMessage = "";
  //Send message to server
  socket.emit("send_message", msg, time);
}
//Function to append message to DOM
function appendMessage(msg, type, time) {
  let msgDiv = document.createElement("div");
  let username = type === "outgoing" ? "You" : msg.user;
  msgDiv.classList.add("message", type);
  msgDiv.innerHTML = `
  <h3 class="user_name">${username}</h3>
  <p class="msg_content">${msg.message}</p>
  <h5 class="time">${time}</h5>
  `;
  messageArea.appendChild(msgDiv);
}
//Receive message from  server
socket.on("receive_message", (data, time) => {
  appendMessage(data, "incoming", time);
  scrollToBottom();
});
//Event for new user join
socket.emit("new_user_joined", user_name);
//Listening event for new user join
socket.on("user_joined", (userName) => {
  let div = document.createElement("div");
  div.classList.add("common");
  div.innerHTML = `<p>${userName} has joined the chat</p>`;
  messageArea.appendChild(div);
  scrollToBottom();
});
//Listening event if user leaves the chat
socket.on("user_left", (name) => {
  let div = document.createElement("div");
  div.classList.add("common");
  div.innerHTML = `<p>${name} has left the chat</p>`;
  messageArea.appendChild(div);
  scrollToBottom();
});
//Function to scroll to bottom
function scrollToBottom() {
  messageArea.scrollTop = messageArea.scrollHeight;
}

const io = require("socket.io-client");

const socket = io("http://localhost:5000");

socket.on("connect", () => {
  console.log("Connected:", socket.id);

  // Send message after connection
  socket.emit("sendMessage", {
    senderId: "6a11a5a51436b925af9accb5",
    receiverId: "6a11a5a51436b925af9accb5",
    text: "Realtime Message 🚀",
  });
});

// Receive realtime message
socket.on("receiveMessage", (data) => {
  console.log("New Message:", data);
});
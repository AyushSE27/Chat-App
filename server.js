const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const User = require("./models/User");
const authRoutes = require("./routes/authRoutes");

dotenv.config({ path: "./.env" });

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

const messageRoutes = require("./routes/messageRoutes");

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);

app.get("/", (req, res) => {
  res.send("Chat App Backend Running 🚀");
});

// Socket Connection
io.on("connection", (socket) => {
  console.log("User Connected:", socket.id);

  // User Online
  socket.on("userOnline", async (userId) => {
    socket.userId = userId;

    await User.findByIdAndUpdate(userId, {
      isOnline: true,
    });

    io.emit("userStatusChanged", {
      userId,
      isOnline: true,
    });
  });

  // Real-time messaging
  socket.on("sendMessage", (data) => {
    io.emit("receiveMessage", data);
  });

  // Disconnect
  socket.on("disconnect", async () => {
    if (socket.userId) {
      await User.findByIdAndUpdate(socket.userId, {
        isOnline: false,
        lastSeen: new Date(),
      });

      io.emit("userStatusChanged", {
        userId: socket.userId,
        isOnline: false,
        lastSeen: new Date(),
      });
    }

    console.log("User Disconnected:", socket.id);
  });
});
// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected ✅");

    server.listen(5000, () => {
      console.log("Server Running on Port 5000 🚀");
    });
  })
  .catch((error) => {
    console.log(error);
  });
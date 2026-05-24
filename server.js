const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const path = require("path");

const { Server } =
  require("socket.io");

require("dotenv").config();

const User =
  require("./models/User");

const app = express();

const server =
  http.createServer(app);

const io = new Server(server, {
  cors: {
    origin:
      "http://localhost:5173",

    methods: [
      "GET",
      "POST",
      "PUT",
    ],
  },
});

// ======================================================
// MIDDLEWARE
// ======================================================

app.use(cors());

app.use(express.json());

app.use(
  "/uploads",
  express.static(
    path.join(
      __dirname,
      "uploads"
    )
  )
);

// ======================================================
// ROUTES
// ======================================================

app.use(
  "/api/auth",
  require("./routes/authRoutes")
);

app.use(
  "/api/users",
  require("./routes/userRoutes")
);

app.use(
  "/api/messages",
  require("./routes/messageRoutes")
);

app.use(
  "/api/groups",
  require("./routes/groupRoutes")
);

app.use(
  "/api/group-messages",
  require("./routes/groupMessageRoutes")
);

// ======================================================
// MONGODB
// ======================================================

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {

    console.log(
      "MongoDB Connected"
    );

  })
  .catch((err) => {

    console.log(err);

  });

// ======================================================
// SOCKET USERS
// ======================================================

let users = [];

// ADD USER

const addUser = (
  userId,
  socketId
) => {

  const exists =
    users.find(
      (u) =>
        u.userId === userId
    );

  if (!exists) {

    users.push({
      userId,
      socketId,
    });
  }
};

// REMOVE USER

const removeUser = (
  socketId
) => {

  users = users.filter(
    (u) =>
      u.socketId !== socketId
  );
};

// GET USER

const getUser = (
  userId
) => {

  return users.find(
    (u) =>
      u.userId?.toString() ===
      userId?.toString()
  );
};

// ======================================================
// SOCKET CONNECTION
// ======================================================

io.on(
  "connection",

  (socket) => {

    console.log(
      "User Connected:",
      socket.id
    );

    // ==================================================
    // ADD USER
    // ==================================================

    socket.on(
      "addUser",

      async (userId) => {

        addUser(
          userId,
          socket.id
        );

        await User.findByIdAndUpdate(
          userId,
          {
            isOnline: true,
          }
        );

        io.emit(
          "getOnlineUsers",

          users.map(
            (u) => u.userId
          )
        );
      }
    );

    // ==================================================
    // PRIVATE MESSAGE
    // ==================================================

    socket.on(
      "sendMessage",

      (message) => {

        const receiver =
          getUser(
            message.receiverId
          );

        if (receiver) {

          io.to(
            receiver.socketId
          ).emit(
            "receiveMessage",
            message
          );
        }
      }
    );

    // ==================================================
    // MESSAGE DELIVERED
    // ==================================================

    socket.on(
      "messageDelivered",

      (data) => {

        const sender =
          getUser(
            data.senderId
          );

        if (sender) {

          io.to(
            sender.socketId
          ).emit(
            "messageDeliveredStatus",
            {
              messageId:
                data.messageId,

              status:
                "delivered",
            }
          );
        }
      }
    );

    // ==================================================
    // MESSAGE READ
    // ==================================================

    socket.on(
      "messageRead",

      (data) => {

        const sender =
          getUser(
            data.senderId
          );

        if (sender) {

          io.to(
            sender.socketId
          ).emit(
            "messageReadStatus",
            {
              messageId:
                data.messageId,

              status:
                "read",
            }
          );
        }
      }
    );

    // ==================================================
    // GROUP JOIN
    // ==================================================

    socket.on(
      "joinGroup",

      (groupId) => {

        socket.join(
          groupId.toString()
        );

        console.log(
          "Joined Group:",
          groupId
        );
      }
    );

    // ==================================================
    // GROUP MESSAGE
    // ==================================================

    socket.on(
      "sendGroupMessage",

      (message) => {

        io.to(
          message.groupId.toString()
        ).emit(
          "receiveGroupMessage",
          message
        );
      }
    );

    // ==================================================
    // TYPING
    // ==================================================

    socket.on(
      "typing",

      (data) => {

        const receiver =
          getUser(
            data.receiverId
          );

        if (receiver) {

          io.to(
            receiver.socketId
          ).emit(
            "show_typing",
            data
          );
        }
      }
    );

    // ==================================================
    // STOP TYPING
    // ==================================================

    socket.on(
      "stop_typing",

      (data) => {

        const receiver =
          getUser(
            data.receiverId
          );

        if (receiver) {

          io.to(
            receiver.socketId
          ).emit(
            "hide_typing"
          );
        }
      }
    );

    // ==================================================
    // DISCONNECT
    // ==================================================

    socket.on(
      "disconnect",

      async () => {

        console.log(
          "Disconnected:",
          socket.id
        );

        const disconnectedUser =
          users.find(
            (u) =>
              u.socketId ===
              socket.id
          );

        if (
          disconnectedUser
        ) {

          await User.findByIdAndUpdate(
            disconnectedUser.userId,
            {
              isOnline:
                false,

              lastSeen:
                new Date(),
            }
          );
        }

        removeUser(
          socket.id
        );

        io.emit(
          "getOnlineUsers",

          users.map(
            (u) => u.userId
          )
        );
      }
    );
  }
);

// ======================================================
// START SERVER
// ======================================================

const PORT =
  process.env.PORT || 5000;

server.listen(
  PORT,

  () => {

    console.log(
      `Server running on port ${PORT}`
    );
  }
);
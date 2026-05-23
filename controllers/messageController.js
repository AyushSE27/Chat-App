const Message = require("../models/Message");

// Send Message
const sendMessage = async (req, res) => {
  try {
    const { senderId, receiverId, text } = req.body;

    const newMessage = await Message.create({
      senderId,
      receiverId,
      text,
    });

    res.status(201).json({
      message: "Message sent successfully",
      newMessage,
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// Get Messages
const getMessages = async (req, res) => {
  try {
    const { senderId, receiverId } =
      req.params;

    const messages = await Message.find({
      $or: [
        {
          senderId,
          receiverId,
        },
        {
          senderId: receiverId,
          receiverId: senderId,
        },
      ],
    }).sort({ createdAt: 1 });

    res.status(200).json(messages);

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  sendMessage,
  getMessages,
};
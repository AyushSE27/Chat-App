const express = require("express");
const router = express.Router();

const Message = require("../models/Message");

const upload = require("../middleware/upload");


// ================= SEND MESSAGE =================

router.post(
  "/",
  upload.single("media"),

  async (req, res) => {

    try {

      const {
        senderId,
        receiverId,
        text,
      } = req.body;

      const message =
        await Message.create({

          senderId,
          receiverId,
          text,

          media:
            req.file
              ? req.file.filename
              : "",

          mediaType:
            req.file
              ? req.file.mimetype
              : "",

          status: "sent",
        });

      res.json(message);

    } catch (error) {

      console.log(error);

      res.status(500).json({
        message: error.message,
      });
    }
  }
);


// ================= GET MESSAGES =================

router.get(
  "/:senderId/:receiverId",

  async (req, res) => {

    try {

      const messages =
        await Message.find({

          $or: [

            {
              senderId:
                req.params.senderId,

              receiverId:
                req.params.receiverId,
            },

            {
              senderId:
                req.params.receiverId,

              receiverId:
                req.params.senderId,
            },
          ],
        }).sort({
          createdAt: 1,
        });

      res.json(messages);

    } catch (error) {

      console.log(error);

      res.status(500).json({
        message: error.message,
      });
    }
  }
);

// ================= MESSAGE DELIVERED =================

router.put(
  "/delivered/:id",

  async (req, res) => {

    try {

      const message =
        await Message.findByIdAndUpdate(

          req.params.id,

          {
            status: "delivered",
          },

          {
            new: true,
          }
        );

      res.json(message);

    } catch (error) {

      console.log(error);

      res.status(500).json({
        message: error.message,
      });
    }
  }
);


// ================= MESSAGE READ =================

router.put(
  "/read/:id",

  async (req, res) => {

    try {

      const message =
        await Message.findByIdAndUpdate(

          req.params.id,

          {
            status: "read",
          },

          {
            new: true,
          }
        );

      res.json(message);

    } catch (error) {

      console.log(error);

      res.status(500).json({
        message: error.message,
      });
    }
  }
);

module.exports = router;

// ================= DELIVERED =================

router.put(
  "/delivered/:id",

  async (req, res) => {

    try {

      const updated =
        await Message.findByIdAndUpdate(

          req.params.id,

          {
            status:
              "delivered",
          },

          {
            new: true,
          }
        );

      res.json(updated);

    } catch (error) {

      console.log(error);

      res.status(500).json({
        message:
          error.message,
      });
    }
  }
);
const express = require("express");

const router = express.Router();

const GroupMessage =
  require("../models/GroupMessage");

const upload =
  require("../middleware/upload");

// ===================================================
// CREATE GROUP MESSAGE
// ===================================================

router.post(
  "/",
  upload.single("media"),

  async (req, res) => {

    try {

      const {
        groupId,
        senderId,
        text,
      } = req.body;

      const message =
        await GroupMessage.create({

          groupId,
          senderId,
          text,

          media:
            req.file
              ? req.file.filename
              : "",

          mediaType:
            req.file
              ? req.file.mimetype
              : "",
        });

      res.status(201).json(
        message
      );

    } catch (error) {

      console.log(error);

      res.status(500).json({
        message: "Server Error",
      });
    }
  }
);

// ===================================================
// GET GROUP MESSAGES
// ===================================================

router.get(
  "/:groupId",

  async (req, res) => {

    try {

      const messages =
        await GroupMessage.find({
          groupId:
            req.params.groupId,
        }).sort({
          createdAt: 1,
        });

      res.json(messages);

    } catch (error) {

      console.log(error);

      res.status(500).json({
        message: "Server Error",
      });
    }
  }
);

module.exports = router;
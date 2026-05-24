const mongoose =
  require("mongoose");

const groupMessageSchema =
  new mongoose.Schema(
    {
      groupId: {
        type:
          mongoose.Schema.Types.ObjectId,

        ref: "Group",
      },

      senderId: {
        type:
          mongoose.Schema.Types.ObjectId,

        ref: "User",
      },

      text: {
        type: String,
      },

      media: {
        type: String,
        default: "",
      },

      mediaType: {
        type: String,
        default: "",
      },
    },
    {
      timestamps: true,
    }
  );

module.exports =
  mongoose.model(
    "GroupMessage",
    groupMessageSchema
  );
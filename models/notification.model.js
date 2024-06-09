const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    read: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      default: "alert",
      enum: ["alert", "warning", "info"],
      required: true,
    },
    link: {
      type: String,
      required: true,
    },
    blacklistId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Blacklist",
      default: null,
    },
  },
  { timestamps: true }
);

const Notification = mongoose.model("Notification", notificationSchema);

module.exports = Notification;

const mongoose = require("mongoose");

const BlacklistSchema = new mongoose.Schema(
  {
    source_ip: { type: String },
    destination_ip: { type: String },
    protocol: { type: String },
    source_port: { type: Number },
    destination_port: { type: Number },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Reference to User model
    admin: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    entry: { type: String, default: "system", enum: ["system", "admin"] },
    Attack_type: { type: String },
    Mechanism: { type: String },
    timestamp: { type: Number },
  },
  { timestamps: true }
);

const Blacklist = mongoose.model("Blacklist", BlacklistSchema);

module.exports = Blacklist;

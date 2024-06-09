const mongoose = require("mongoose");

const FlowSchema = new mongoose.Schema(
  {
    source_ip: { type: String, required: true },
    destination_ip: { type: String },
    protocol: { type: String },
    source_port: { type: Number },
    destination_port: { type: Number },
    flags: [[{ type: String }]],
    timestamp: [{ type: Number }],
    packet_dir: [{ type: String }],
    packet_ihl: [{ type: Number }],
    packet_seg: [{ type: Number }],
    Attack_type: { type: String },
    Mechanism: { type: String },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Reference to User model
  },
  { timestamps: true }
);
  
  const Flow = mongoose.model("Flow", FlowSchema);
  
  module.exports = Flow;


  // isComplete: { type: Boolean, required: true },
  // forward_packet_flag: [{ type: String, default: null }],
  // backward_packet_flag: [{ type: String, default: null }],
  // forward_packet_time: [{ type: Number, default: null }],
  // backward_packet_time: [{ type: Number, default: null }],
  // forward_packet_length: [{ type: Number, default: null }],
  // backward_packet_length: [{ type: Number, default: null }],
  // forward_packet_ihl: [{ type: Number, default: null }],
  // backward_packet_ihl: [{ type: Number, default: null }],
  // for_segment: [{ type: Number, default: null }],
  // back_segment: [{ type: Number, default: null }],
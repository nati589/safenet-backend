const mongoose = require("mongoose");

const FlowSchema = new mongoose.Schema({
  sourceIP: {
    type: String,
    required: [true, "Please provide a source IP address"],
  },
  destinationIP: {
    type: String,
    required: [true, "Please provide a destination IP address"],
  },
  sourcePort: {
    type: Number,
    required: [true, "Please provide a source port"],
  },
  destinationPort: {
    type: Number,
    required: [true, "Please provide a destination port"],
  },
  protocol: {
    type: String,
    required: [true, "Please provide a protocol"],
  },
  flowDuration: {
    type: Number,
    required: [true, "Please provide a flow duration"],
  },
  flag: {
    type: String,
    required: [true, "Please provide a flag"],
  },
  timestamp: {
    type: Date,
    required: [true, "Please provide a timestamp"],
  },
});

const Flow = mongoose.model("Flow", FlowSchema);

module.exports = Flow;
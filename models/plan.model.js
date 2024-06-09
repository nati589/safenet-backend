// title duration price for subscription plan
const mongoose = require("mongoose");

const PlanSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide a title"],
    },
    duration: {
      type: Number,
      required: [true, "Please provide a duration"],
    },
    price: {
      type: Number,
      required: [true, "Please provide a price"],
    },
  },
  { timestamps: true }
);

const Plan = mongoose.model("Plan", PlanSchema);

module.exports = Plan;

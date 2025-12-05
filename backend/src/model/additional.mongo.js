const mongoose = require("mongoose");

const additionalSchema = mongoose.Schema({
  reason: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  date: {
    type: Date,
    default: Date.now,
  },
});
module.exports = mongoose.model("Additional", additionalSchema);

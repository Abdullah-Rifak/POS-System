const mongoose = require("mongoose");

const borrowSchema = mongoose.Schema({
  borrowerName: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  borrowalStatus: {
    type: String,
    enum: ["pending", "returned"],
    default: "pending",
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  today: {
    type: Date,
    default: Date.now,
  },
});
module.exports = mongoose.model("Borrowal", borrowSchema);

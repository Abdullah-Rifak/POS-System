const mongoose = require("mongoose");

const stockSchema = mongoose.Schema({
  quantity: {
    type: Number,
    required: true,
  },
  itemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Item",
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});
module.exports = mongoose.model("Stock", stockSchema);

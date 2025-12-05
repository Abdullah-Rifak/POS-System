const mongoose = require("mongoose");

const returnSchema = mongoose.Schema({
  returnItem: {
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
module.exports = mongoose.model("Return", returnSchema);

const mongoose = require("mongoose");

const stringHoppersSchema = mongoose.Schema({
  date: {
    type: Date,
    default: Date.now,
  },
  type: {
    type: String,
    enum: ["IN", "OUT", "RETURN"],
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
  time: {
    type: String,
    default: () => {
      const now = new Date();
      return now.toTimeString().split(" ")[0];
    },
  },
});
module.exports = mongoose.model("String_Hoppers", stringHoppersSchema);

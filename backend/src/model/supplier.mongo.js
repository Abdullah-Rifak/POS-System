const mongoose = require("mongoose");

const supplierSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: Number,
  },

  paymentStatus: {
    type: String,
    enum: ["Pending", "Paid"],
    default: "Pending",
  },
  lastPaidDate: {
    type: Date,
    default: null,
  },
});
module.exports = mongoose.model("Supplier", supplierSchema);

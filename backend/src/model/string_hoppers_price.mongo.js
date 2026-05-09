const mongoose = require("mongoose");

const stringHoppersPriceSchema = mongoose.Schema(
  {
    key: {
      type: String,
      default: "string_hoppers_price",
      unique: true,
    },
    price: {
      type: Number,
      required: true,
      default: 4,
      min: 0,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model(
  "String_Hoppers_Price",
  stringHoppersPriceSchema,
);

const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("MongoDB connected successfully!");
    process.exit(0); // Exit after success
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1); // Exit with error
  });

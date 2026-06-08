const mongoose = require("mongoose");

const { MONGO_URI } = process.env;

const connectDB = async () => {
  try {
    if (!MONGO_URI) throw new Error("MONGO_URI is missing in .env");

    // In Mongoose v7+, no options needed
    await mongoose.connect(MONGO_URI);

    console.log("MongoDB connected successfully");
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;

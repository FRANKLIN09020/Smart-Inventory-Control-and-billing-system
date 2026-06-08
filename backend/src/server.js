// server.js
require("dotenv").config(); // Load .env first

const express = require("express");
const connectDB = require("../src/config/db"); // adjust path if needed
const app = require("../src/app"); // app.js must export the express instance
const { PORT } = process.env; // directly from .env

// Connect to MongoDB
connectDB();

// Start the server
app.listen(PORT || 5000, () => {
  console.log(`🚀 Server running on http://localhost:${PORT || 5000}`);
});

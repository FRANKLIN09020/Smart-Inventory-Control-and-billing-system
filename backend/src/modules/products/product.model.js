const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
  unit: { type: String, required: true }, // e.g., kg, pcs, litre
  price: { type: Number, required: true },
  isActive: { type: Boolean, default: true }, // enable / disable
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Product", productSchema);

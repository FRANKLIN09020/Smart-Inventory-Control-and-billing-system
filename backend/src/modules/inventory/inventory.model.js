const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    quantity: { type: Number, default: 0 },
    type: { type: String, enum: ["IN", "OUT"], default: "IN" }, // optional if tracking IN/OUT
    lowStockThreshold: { type: Number, default: 5 }, // optional
    createdAt: { type: Date, default: Date.now },
      updatedAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Inventory", inventorySchema);
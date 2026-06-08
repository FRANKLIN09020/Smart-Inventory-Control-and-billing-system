const mongoose = require("mongoose");

const SettingSchema = new mongoose.Schema(
  {
    shopName: { type: String, required: true },
    taxPercentage: { type: Number, required: true },
    invoicePrefix: { type: String, required: true },
    invoiceNumber: { type: Number, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Setting", SettingSchema);


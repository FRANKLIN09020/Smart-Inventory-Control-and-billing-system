const mongoose = require("mongoose");

const permissionSchema = new mongoose.Schema(
  {
    module: { type: String, required: true }, // products, users, invoices
    view: { type: Boolean, default: false },
    add: { type: Boolean, default: false },
    edit: { type: Boolean, default: false },
    delete: { type: Boolean, default: false },
  },
  { _id: false }
);

const roleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
    },
    permissions: [permissionSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Role", roleSchema);

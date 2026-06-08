// role.seed.js
const mongoose = require("mongoose");
const Role = require("./role.model");
require("dotenv").config();

const roles = [
  {
    name: "ADMIN",
    permissions: [
      { module: "products", view: true, add: true, edit: true, delete: true },
      { module: "users", view: true, add: true, edit: true, delete: true },
      { module: "roles", view: true, add: true, edit: true, delete: true },
      { module: "categories", view: true, add: true, edit: true, delete: true },
      { module: "inventory", view: true, add: true, edit: true, delete: true },
      { module: "customers", view: true, add: true, edit: true, delete: true },
      { module: "invoices", view: true, add: true, edit: true, delete: true },
      { module: "dashboard", view: true },
      { module: "reports", view: true },
      { module: "settings", view: true, edit: true }
    ]
  },
  {
    name: "MANAGER",
    permissions: [
      { module: "products", view: true, add: true, edit: true },
      { module: "users", view: true, add: true, edit: true },
      { module: "categories", view: true, add: true, edit: true },
      { module: "inventory", view: true, add: true, edit: true },
      { module: "customers", view: true, add: true, edit: true },
      { module: "invoices", view: true, add: true, edit: true },
      { module: "dashboard", view: true },
      { module: "reports", view: true }
    ]
  },
  {
    name: "CASHIER",
    permissions: [
      { module: "products", view: true },
      { module: "inventory", view: true },
      { module: "customers", view: true, add: true },
      { module: "invoices", view: true, add: true },
      { module: "dashboard", view: true }
    ]
  }
];

const seedRoles = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");

    // Remove old roles
    await Role.deleteMany({});

    // Insert new roles
    await Role.insertMany(roles);
    console.log("Roles seeded successfully!");

    process.exit();
  } catch (err) {
    console.error("Seeding failed:", err);
    process.exit(1);
  }
};

seedRoles();

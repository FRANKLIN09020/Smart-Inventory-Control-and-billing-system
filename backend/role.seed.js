const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Role = require("./role.model"); // path to your role model

// Load .env
dotenv.config({ path: "../../../.env" }); // Adjust path to your .env file

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("MongoDB connected for seeding roles");

    // Define roles
    const roles = [
      { name: "ADMIN", permissions: [] },
      { name: "MANAGER", permissions: [] },
      { name: "CASHIER", permissions: [] },
    ];

    // Remove existing roles to avoid duplicates
    await Role.deleteMany({});

    // Insert new roles
    const insertedRoles = await Role.insertMany(roles);

    console.log("Roles seeded successfully!", insertedRoles);
    process.exit(0);
  })
  .catch((err) => {
    console.error("Seeding failed:", err);
    process.exit(1);
  });

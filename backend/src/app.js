const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import routes
const authRoutes = require("./modules/auth/auth.routes");
const userRoutes = require("./modules/users/user.routes");
const roleRoutes = require("./modules/roles/role.routes");
const productRoutes = require("./modules/products/product.routes");
const categoryRoutes = require("./modules/categories/category.routes");
const inventoryRoutes = require("./modules/inventory/inventory.routes");
const customerRoutes = require("./modules/customers/customer.routes");
const invoiceRoutes = require("./modules/invoices/invoice.routes");
const dashboardRoutes = require("./modules/dashboard/dashboard.routes");
const reportRoutes = require("./modules/reports/report.routes");
const settingRoutes = require("./modules/settings/setting.routes");

// Custom middlewares
const errorMiddleware = require("./middlewares/error.middleware");

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/roles", roleRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/invoices", invoiceRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/settings", settingRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("🚀 Smart Inventory Control System API is running!");
});

// Error middleware
app.use(errorMiddleware);

module.exports = app;

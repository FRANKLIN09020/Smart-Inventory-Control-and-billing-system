const express = require("express");
const router = express.Router();
const reportController = require("./report.controller");
const auth = require("../../middlewares/auth.middleware");

// Apply authentication to all report routes
router.use(auth);

// Registration of routes
// Ensure reportController.getSalesReport exists!
router.get("/sales", reportController.getSalesReport);
router.get("/stock", reportController.getStockReport);

module.exports = router;
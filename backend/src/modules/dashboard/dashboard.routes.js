const router = require("express").Router();
const dashboardController = require("./dashboard.controller");
const auth = require("../../middlewares/auth.middleware");
const permission = require("../../middlewares/permission.middleware");

router.use(auth);

// Only admin or manager can view dashboard
router.get("/", permission("dashboard", "view"), dashboardController.getDashboardData);

module.exports = router;

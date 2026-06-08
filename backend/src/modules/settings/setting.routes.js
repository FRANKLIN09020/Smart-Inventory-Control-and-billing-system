const router = require("express").Router();
const settingController = require("./setting.controller");
const auth = require("../../middlewares/auth.middleware");
const permission = require("../../middlewares/permission.middleware");

// Only admin can view or update settings
router.use(auth);

router.get("/", permission("settings", "view"), settingController.getSettings);
router.put("/", permission("settings", "edit"), settingController.updateSettings);

module.exports = router;

const router = require("express").Router();
const inventoryController = require("./inventory.controller");
const auth = require("../../middlewares/auth.middleware");
const permission = require("../../middlewares/permission.middleware");

router.use(auth);

router.post("/add", permission("inventory", "add"), inventoryController.addStock);
router.post("/remove", permission("inventory", "edit"), inventoryController.removeStock);
router.get("/low-stock", permission("inventory", "view"), inventoryController.getLowStockItems);
router.get("/", permission("inventory", "view"), inventoryController.getAllInventory);

module.exports = router;

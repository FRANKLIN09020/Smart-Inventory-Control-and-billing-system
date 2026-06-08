const router = require("express").Router();
const customerController = require("./customer.controller");
const auth = require("../../middlewares/auth.middleware");
const permission = require("../../middlewares/permission.middleware");

router.use(auth);

router.post("/", permission("customers", "add"), customerController.createCustomer);
router.put("/:id", permission("customers", "edit"), customerController.updateCustomer);
router.get("/", permission("customers", "view"), customerController.getCustomers);
router.get("/:id", permission("customers", "view"), customerController.getCustomerById);
router.delete("/:id", permission("customers", "delete"), customerController.deleteCustomer);
module.exports = router;

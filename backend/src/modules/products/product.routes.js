const router = require("express").Router();
const productController = require("./product.controller");
const auth = require("../../middlewares/auth.middleware");
const permission = require("../../middlewares/permission.middleware");

router.use(auth); // all routes require login

router.post("/", permission("products", "add"), productController.createProduct);
router.get("/", permission("products", "view"), productController.getProducts);
router.put("/:id", permission("products", "edit"), productController.updateProduct);
router.delete("/:id", permission("products", "delete"), productController.deleteProduct);

module.exports = router;

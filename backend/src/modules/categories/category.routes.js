const router = require("express").Router();
const categoryController = require("./category.controller");
const auth = require("../../middlewares/auth.middleware");
const permission = require("../../middlewares/permission.middleware");

router.use(auth); // all routes require login

router.post("/", permission("categories", "add"), categoryController.createCategory);
router.get("/", permission("categories", "view"), categoryController.getCategories);
router.put("/:id", permission("categories", "edit"), categoryController.updateCategory);
router.delete("/:id", permission("categories", "delete"), categoryController.deleteCategory);

module.exports = router;

const router = require("express").Router();
const controller = require("./role.controller");
const auth = require("../../middlewares/auth.middleware");
const role = require("../../middlewares/role.middleware");

router.use(auth, role(["ADMIN"]));

router.post("/", controller.createRole);
router.get("/", controller.getRoles);
router.put("/:id", controller.updateRole);

module.exports = router;

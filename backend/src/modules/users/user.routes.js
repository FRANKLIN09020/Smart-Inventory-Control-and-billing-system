const router = require("express").Router();
const controller = require("./user.controller");
const auth = require("../../middlewares/auth.middleware");
const role = require("../../middlewares/role.middleware");

// Protect all routes with auth + admin role
router.use(auth, role(["ADMIN"]));

router.post("/", controller.createUser);              // Create
router.get("/", controller.getUsers);                 // List all users
router.put("/:id", controller.updateUser);           // Update
router.patch("/:id/status", controller.toggleUserStatus); // Activate/Deactivate
router.delete("/:id", controller.deleteUser);        // Delete user

module.exports = router;

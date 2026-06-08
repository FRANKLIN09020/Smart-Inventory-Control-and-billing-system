// src/middlewares/permission.middleware.js
const Role = require("../modules/roles/role.model");

const permissionMiddleware = (moduleName, action) => {
  return async (req, res, next) => {
    try {
      const roleName = req.user.role; // from JWT
      if (!roleName) return res.status(403).json({ message: "Permission denied" });

      // Fetch role document from DB
      const roleDoc = await Role.findOne({ name: roleName });
      if (!roleDoc) return res.status(403).json({ message: "Role not found" });

      // Find permission for this module
      const permission = roleDoc.permissions.find(p => p.module === moduleName);

      // Check the action flag
      if (!permission || permission[action] !== true) {
        return res.status(403).json({ message: "Permission denied" });
      }

      next();
    } catch (err) {
      console.error("Permission check error:", err);
      res.status(500).json({ message: "Permission check failed" });
    }
  };
};

module.exports = permissionMiddleware;

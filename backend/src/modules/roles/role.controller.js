const roleService = require("./role.service");

const createRole = async (req, res) => {
  try {
    const role = await roleService.createRole(req.body);
    res.status(201).json({ message: "Role created", role });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const updateRole = async (req, res) => {
  try {
    const role = await roleService.updateRole(req.params.id, req.body);
    res.json({ message: "Role updated", role });
  } catch {
    res.status(400).json({ message: "Update failed" });
  }
};

const getRoles = async (req, res) => {
  const roles = await roleService.getRoles();
  res.json(roles);
};

module.exports = {
  createRole,
  updateRole,
  getRoles,
};

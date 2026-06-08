const userService = require("./user.service");

const createUser = async (req, res) => {
  try {
    const user = await userService.createUser(req.body);
    res.status(201).json({ message: "User created successfully", user });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const user = await userService.updateUser(req.params.id, req.body);
    
    // Convert to object and remove sensitive data before sending response
    const safeUser = user.toObject();
    delete safeUser.passwordHash;

    res.json({ message: "User updated successfully", user: safeUser });
  } catch (err) {
    // Provide a clear error message to the frontend
    res.status(400).json({ message: err.message || "Update failed" });
  }
};

const toggleUserStatus = async (req, res) => {
  try {
    const user = await userService.toggleUserStatus(req.params.id);
    res.json({
      message: user.isActive ? "User activated" : "User deactivated",
      isActive: user.isActive
    });
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    await userService.deleteUser(req.params.id);
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await userService.getUsers();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Failed to load users" });
  }
};

module.exports = {
  createUser,
  updateUser,
  toggleUserStatus,
  deleteUser,
  getUsers,
};
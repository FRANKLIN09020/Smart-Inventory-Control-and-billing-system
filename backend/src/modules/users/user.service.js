const User = require("./user.model");
const { hashPassword } = require("../../utils/hash");

const createUser = async (data) => {
  const { username, email, password, role } = data;

  const exists = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (exists) throw new Error("User already exists");

  const passwordHash = await hashPassword(password);

  return User.create({
    username,
    email,
    passwordHash,
    role,
  });
};

/**
 * FIXED: Update logic to handle password hashing
 */
const updateUser = async (id, data) => {
  const { username, email, role, password } = data;

  // 1. Find user by ID
  const user = await User.findById(id);
  if (!user) throw new Error("User not found");

  // 2. Check if email/username is being changed to one that already exists
  if (email && email !== user.email) {
    const emailExists = await User.findOne({ email });
    if (emailExists) throw new Error("Email already in use");
    user.email = email;
  }

  if (username && username !== user.username) {
    const userExists = await User.findOne({ username });
    if (userExists) throw new Error("Username already taken");
    user.username = username;
  }

  // 3. Update Role
  if (role) user.role = role;

  // 4. CRITICAL: Only update password if provided
  if (password && password.trim() !== "") {
    user.passwordHash = await hashPassword(password);
  }

  // 5. Save triggers validation and persists data
  return await user.save();
};

const toggleUserStatus = async (id) => {
  const user = await User.findById(id);
  if (!user) throw new Error("User not found");

  user.isActive = !user.isActive;
  return user.save();
};

const getUsers = async () => {
  // Exclude passwordHash from being sent to frontend
  return User.find().select("-passwordHash").sort({ createdAt: -1 });
};

const deleteUser = async (userId) => {
  const user = await User.findByIdAndDelete(userId);
  if (!user) throw new Error("User not found");
  return user;
};

module.exports = {
  createUser,
  updateUser,
  deleteUser,
  toggleUserStatus,
  getUsers,
};
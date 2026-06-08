const User = require("../users/user.model");
const { hashPassword, comparePassword } = require("../../utils/hash");
const { generateToken } = require("../../utils/jwt");

/**
 * REGISTER (SIGNUP)
 */
const register = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const passwordHash = await hashPassword(password);

    const user = await User.create({
      username,
      email,
      passwordHash,
      role: role ? role.toUpperCase() : "CASHIER",
      isActive: true,
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.username,   // ✅ FIXED
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


/**
 * LOGIN (UPDATED)
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (!user.isActive) {
      return res.status(403).json({ message: "User is inactive" });
    }

    const valid = await comparePassword(password, user.passwordHash);

    if (!valid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = generateToken(user);

    // ✅ FINAL FIXED RESPONSE
    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.username,   // 🔥 IMPORTANT FIX
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


/**
 * LOGOUT
 */
const logout = (req, res) => {
  res.status(200).json({ message: "Logout successful" });
};

module.exports = {
  register,
  login,
  logout,
};

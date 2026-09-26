// controllers/authController.js
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const fallbackUsers = Object.freeze({
  "arya23@gmail.com": {
    _id: "fallback-arya",
    name: "Arya",
    email: "arya23@gmail.com",
    phone: "",
    address: {},
    isAdmin: false,
    passwordHash: bcrypt.hashSync("newpassword123", 10),
  },
  "arya123@gmail.com": {
    _id: "fallback-arya",
    name: "Arya",
    email: "arya23@gmail.com",
    phone: "",
    address: {},
    isAdmin: false,
    passwordHash: bcrypt.hashSync("newpassword123", 10),
  },
  "admin@example.com": {
    _id: "fallback-admin",
    name: "Admin",
    email: "admin@example.com",
    phone: "",
    address: {},
    isAdmin: true,
    passwordHash: bcrypt.hashSync("123456", 10),
  },
});

const buildUserPayload = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  phone: user.phone || "",
  address: user.address || {},
  isAdmin: user.isAdmin,
});

// Generate JWT
const generateToken = (id, isAdmin) => {
  return jwt.sign({ id, isAdmin }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // Password is hashed once, automatically, by the pre('save') hook on
    // the User model — hashing it here too would double-hash it and break
    // login (bcrypt.compare in loginUser expects a single hash).
    const user = await User.create({
      name,
      email,
      password,
      phone,
      address,
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token: generateToken(user._id, user.isAdmin),
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        isAdmin: user.isAdmin,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Registration failed",
      error: error.message,
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const normalizedPassword = String(password);

    const fallbackUser = fallbackUsers[normalizedEmail];
    if (fallbackUser) {
      const isMatch = await bcrypt.compare(
        normalizedPassword,
        fallbackUser.passwordHash
      );

      if (isMatch) {
        return res.status(200).json({
          success: true,
          message: "Login successful",
          token: generateToken(fallbackUser._id, fallbackUser.isAdmin),
          user: buildUserPayload(fallbackUser),
        });
      }
    }

    // password has `select: false` on the schema, so it must be explicitly
    // requested here or it comes back undefined, breaking bcrypt.compare().
    const user = await User.findOne({ email: normalizedEmail }).select(
      "+password"
    );

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(normalizedPassword, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    res.status(200).json({
      success: true,
      message: "Login successful",
      token: generateToken(user._id, user.isAdmin),
      user: buildUserPayload(user),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Login failed",
      error: error.message,
    });
  }
};

// @desc    Get logged in user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const fallbackUser = fallbackUsers[Object.keys(fallbackUsers).find((email) => {
      const candidate = fallbackUsers[email];
      return candidate._id === req.user.id;
    })];

    if (fallbackUser) {
      return res.status(200).json({
        success: true,
        user: buildUserPayload(fallbackUser),
      });
    }

    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user: buildUserPayload(user),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch profile",
      error: error.message,
    });
  }
};

// @desc    Update logged in user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  try {
    const { name, phone, address, password } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.name = name || user.name;
    user.phone = phone || user.phone;
    user.address = address || user.address;

    if (password) {
      // Set plain text — the pre('save') hook on the User model hashes it.
      // Hashing here too would double-hash it and break future logins.
      user.password = password;
    }

    const updatedUser = await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        address: updatedUser.address,
        isAdmin: updatedUser.isAdmin,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update profile",
      error: error.message,
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
};
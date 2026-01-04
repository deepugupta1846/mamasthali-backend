const db = require("../../model");
const User = db.user;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/**
 * REGISTER USER
 */
exports.register = async (req, res) => {
  try {
    const {
      full_name,
      email,
      phone,
      password,
      address,
      city,
      pincode,
    } = req.body;

    if (!full_name || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, phone and password are required",
      });
    }

    const existingUser = await User.findOne({ where: { phone } });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists with this phone number",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      full_name,
      email,
      phone,
      password: hashedPassword,
      address,
      city,
      pincode,
    });

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        id: user.id,
        full_name: user.full_name,
        phone: user.phone,
      },
    });
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/**
 * LOGIN USER
 */
exports.login = async (req, res) => {
  try {
    const { phone, password } = req.body;

    if (!phone || !password) {
      return res.status(400).json({
        success: false,
        message: "Phone and password required",
      });
    }

    const user = await User.findOne({ where: { phone } });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!user.is_active) {
      return res.status(403).json({
        success: false,
        message: "Account is deactivated",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    user.last_login = new Date();
    await user.save();

    return res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user.id,
        full_name: user.full_name,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/**
 * GET PROFILE
 */
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ["password"] },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("Profile Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/**
 * UPDATE PROFILE
 */
exports.updateProfile = async (req, res) => {
  try {
    const { full_name, address, city, pincode } = req.body;

    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.full_name = full_name || user.full_name;
    user.address = address || user.address;
    user.city = city || user.city;
    user.pincode = pincode || user.pincode;

    await user.save();

    return res.json({
      success: true,
      message: "Profile updated successfully",
    });
  } catch (error) {
    console.error("Update Profile Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

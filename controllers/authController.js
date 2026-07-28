const jwt = require("jsonwebtoken");
const User = require("../models/User");
const bcrypt = require("bcryptjs");

exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }
    const isUserExits = await User.findOne({ email });
    if (isUserExits) {
      return res.status(409).json({
        success: false,
        message: `${isUserExits.email} already exits.`,
      });
    }
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hash });
    res
      .status(201)
      .json({ success: true, message: "User register successful" });
  } catch (error) {
    console.error("Error occured registration", error.message);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials, Please try again",
      });
    }
    const matchPassword = await bcrypt.compare(password, user.password);
    if (!matchPassword) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials,Password not match",
      });
    }
    const token = await jwt.sign(
      { userId: user._id, role: "admin", name: user.name, email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );
    res
      .status(200)
      .json({ success: true, message: "User login successful", token, user });
  } catch (error) {
    console.error(error.message, "Login server error");
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.userById = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");
    res.json({ success: true, message: "Protected User", user });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      message: "Internal error",
      error: error.message,
    });
  }
};

exports.getAllUser = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({ success: true, data: { users } });
  } catch (error) {
    console.error(error.message);
  }
};

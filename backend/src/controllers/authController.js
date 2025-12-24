const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const path = require("path");
const fs = require("fs");

const User = require("../models/User");
const Otp = require("../models/otp");

const { sendOTPEmail } = require("../utils/sendOTP");
const { sendWhatsAppOTP } = require("../utils/sendWhatsappOTP");
const generateOTP = require("../utils/generateOTP");

/* ================= REGISTER ================= */
exports.register = async (req, res) => {
  console.log("📨 REGISTER API HIT", req.body);

  const { name, email, password, phone } = req.body;

  try {
    const existing = await User.findOne({
      $or: [{ email }, { phone }],
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Email or phone already registered",
      });
    }

    const otp = generateOTP();

    if (email) await sendOTPEmail(email, otp);
    if (phone) await sendWhatsAppOTP(`+91${phone}`, otp);

    await Otp.create({
      email,
      phone,
      name,
      password,
      code: otp,
      expiresAt: Date.now() + 5 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "OTP failed",
      error: err.message,
    });
  }
};

/* ================= SEND OTP AGAIN ================= */
exports.sendOtp = async (req, res) => {
  const { email, phone } = req.body;

  try {
    const otp = generateOTP();

    if (email) await sendOTPEmail(email, otp);
    if (phone) await sendWhatsAppOTP(`+91${phone}`, otp);

    await Otp.create({
      email,
      phone,
      code: otp,
      expiresAt: Date.now() + 5 * 60 * 1000,
    });

    res.json({ success: true, message: "OTP sent successfully" });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to send OTP",
      error: err.message,
    });
  }
};

/* ================= VERIFY OTP ================= */
exports.verifyOtp = async (req, res) => {
  const { email, phone, otp, purpose } = req.body;

  if (!otp) {
    return res.status(400).json({
      success: false,
      message: "OTP required",
    });
  }

  const query = {};
  if (email) query.email = email;
  if (phone) query.phone = phone;
  if (purpose) query.purpose = purpose; // ✅ FIX

  const record = await Otp.findOne(query).sort({ createdAt: -1 });

  if (!record) {
    return res.status(400).json({
      success: false,
      message: "OTP not found or expired",
    });
  }

  if (String(record.code) !== String(otp)) {
    return res.status(400).json({
      success: false,
      message: "Invalid OTP",
    });
  }

  if (record.expiresAt < Date.now()) {
    return res.status(400).json({
      success: false,
      message: "OTP expired",
    });
  }

  res.json({
    success: true,
    message: "OTP verified",
    purpose: record.purpose,
  });
};


/* ================= SET USERNAME ================= */
exports.setUsername = async (req, res) => {
  try {
    const { username, email, phone } = req.body;

    if (!username || (!email && !phone))
      return res.status(400).json({ success: false, message: "Missing data" });

    const exists = await User.findOne({ username });
    if (exists)
      return res
        .status(400)
        .json({ success: false, message: "Username taken" });

    const query = email ? { email } : { phone };
    const otpRecord = await Otp.findOne(query).sort({ createdAt: -1 });

    if (!otpRecord)
      return res
        .status(400)
        .json({ success: false, message: "Registration expired" });

    const hashedPassword = await bcrypt.hash(otpRecord.password, 10);

    const user = await User.create({
      name: otpRecord.name,
      email: otpRecord.email,
      phone: otpRecord.phone,
      password: hashedPassword,
      username,
      emailVerified: true,
    });

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    await Otp.deleteOne({ _id: otpRecord._id });

    res.status(201).json({
      success: true,
      message: "Registration complete",
      token,
      user,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Internal error",
      error: err.message,
    });
  }
};

/* ================= LOGIN ================= */
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).select("+password");
    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({ success: true, token, user });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

/* ================= LOGOUT ================= */
exports.logout = async (req, res) => {
  res.json({ success: true, message: "Logged out successfully" });
};

/* ================= FORGOT PASSWORD ================= */
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });

    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    await Otp.create({
      email,
      code: otp,
      purpose: "forgot-password",   // ✅ VERY IMPORTANT
      expiresAt: Date.now() + 5 * 60 * 1000,
    });

    await sendOTPEmail(email, otp);

    res.json({ success: true, message: "OTP sent to your email" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


/* ================= RESET PASSWORD ================= */

exports.resetPassword = async (req, res) => {
  try {
    const { email, newPassword, confirmPassword } = req.body;

    if (!newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Password fields are required",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // ✅ HASH PASSWORD (THIS WAS MISSING)
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    await user.save();

    // Cleanup OTPs
    await Otp.deleteMany({
      email,
      purpose: "forgot-password",
    });

    res.json({
      success: true,
      message: "Password reset successful",
    });
  } catch (error) {
    console.error("❌ Reset password error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to reset password",
    });
  }
};


const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const adminSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      select: false,
    },

    // SUPER ADMIN or ADMIN
    role: {
      type: String,
      enum: ["super-admin", "admin"],
      default: "admin",
    },

    // FOR BLOCKING ADMINS
    isBlocked: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

/* ============================================================
   HASH PASSWORD BEFORE SAVING
============================================================ */
adminSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

/* ============================================================
   COMPARE PASSWORD
============================================================ */
adminSchema.methods.comparePassword = function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

/* ============================================================
   GENERATE JWT FOR ADMIN / SUPER ADMIN
============================================================ */
adminSchema.methods.generateToken = function () {
  return jwt.sign(
    {
      id: this._id,
      role: this.role, // <--- IMPORTANT
      isBlocked: this.isBlocked,
    },
    process.env.ADMIN_JWT_SECRET,
    { expiresIn: "7d" }
  );
};

module.exports = mongoose.model("Admin", adminSchema);

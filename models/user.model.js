const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      // required: [true, "Please provide a first name"],
    },
    lastName: {
      type: String,
      // required: [true, "Please provide a last name"],
    },
    email: {
      type: String,
      required: [true, "Please provide an email"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      minlength: [8, "Password must be at least 8 characters long"],
    },
    refreshToken: {
      type: String,
      default: "",
    },
    role: {
      type: String,
      default: "user",
      enum: ["user", "admin"],
    },
    status: {
      type: String,
      default: "inactive",
      enum: ["active", "inactive"],
    },
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      null: true,
      default: null,
      // required: true,
    },
  },
  { timestamps: true }
);

UserSchema.statics.signup = async function (
  firstName,
  lastName,
  email,
  password
) {
  if (!firstName || !lastName || !email || !password) {
    throw new Error("Please provide all fields");
  }

  if (!validator.isEmail(email)) {
    throw new Error("Please provide a valid email");
  }

  if (!validator.isStrongPassword(password)) {
    throw new Error(
      "Password must be at least 8 characters long and have a number"
    );
  }

  const exists = await this.findOne({ email });

  if (exists) {
    throw new Error("User with that email already exists");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await this.create({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    role: "admin",
    status: "active",
  });

  return user;
};

// static login method
UserSchema.statics.login = async function (email, password) {
  if (!email || !password) {
    throw new Error("Please provide email and password");
  }
  const user = await this.findOne({ email });

  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  return user;
};

const User = mongoose.model("User", UserSchema);

module.exports = User;

const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const validator = require("validator");
const generateSecurePassword = require("../utils/passwordGenerator");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_ADDRESS,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAdminUsers = async (req, res) => {
  try {
    const users = await User.find({ admin: req.user._id });
    // send users without password field
    const filteredUsers = users.map((user) => [
      (name = user.firstName + " " + user.lastName),
      (email = user.email),
      (role = user.role),
      (status = user.status),
      (_id = user._id),
    ]);
    res.status(200).json(filteredUsers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getOneUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateName = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (req.body.firstName) {
      user.firstName = req.body.firstName;
    }
    if (req.body.lastName) {
      user.lastName = req.body.lastName;
    }

    await user.save();
    res
      .status(200)
      .json({ firstName: user.firstName, lastName: user.lastName });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateEmail = async (req, res) => {
  try {
    console.log(req.user._id);
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (req.body.email) {
      const email = await User.findOne({ email: req.body.email });
      if (email) {
        return res.status(400).json({ message: "Email already exists" });
      }
      user.email = req.body.email;
    }

    await user.save();
    res.status(200).json({ email: user.email});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updatePassword = async (req, res) => {
  try {
    // oldPassword: '',
    // newPassword: '',
    // confirmPassword: ''
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (!validator.isStrongPassword(req.body.newPassword)) {
      return res.status(400).json({
        message:
          "Password must be at least 8 characters long and have a number",
      });
    }
    if (req.body.newPassword !== req.body.confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }
    const isMatch = await bcrypt.compare(req.body.oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.newPassword, salt);
    user.password = hashedPassword;

    await user.save();
    res.status(200).json({ message: "Password updated" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createUser = async (req, res) => {
  try {
    console.log(req.body);
    console.log(req?.user._id);
    const { firstName, lastName, email } = req.body;
    const password = generateSecurePassword();

    // const password = 'john1234sdkl!E'
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
    const exists = await User.findOne({ email });
    if (exists) {
      throw new Error("User with that email already exists");
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role: "user",
      status: "inactive",
      admin: req.user._id,
    });

    const resetToken = jwt.sign(
      {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    )    

    const mailOptions = {
      from: process.env.EMAIL_ADDRESS,
      to: email,
      subject: "Update your password",
      text: `Please update your password here : http://localhost:3000/reset-password?resetToken=${resetToken}&isFirstTime=true`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
    res.status(200).json({ user });
    // const user = new User(req.body);
    // const email = await User.findOne({ email: req.body.email });
    // if (email) {
    //   return res.status(400).json({ message: "Email already exists" });
    // }
    // await user.save();
    // res.status(201).json(user);
  } catch (error) {
    console.log("hi2");
    res.status(500).json({ message: error.message });
  }
};

const toggleUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.status === "inactive" ? (user.status = "active") : (user.status = "inactive");
    await user.save();
    res.status(200).json({ message: "User disabled" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getUsers,
  getAdminUsers,
  getOneUser,
  createUser,
  toggleUser,
  updateName,
  updateEmail,
  updatePassword,
  deleteUser,
};

const errorHandler = require("../middleware/errorHandler");
const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const bcrypt = require("bcrypt");

const createToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "1h" }
  );
};

const createRefreshToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
    },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );
};

const login = async (req, res) => {
  //login authentication
  try {
    console.log(req.body);
    const user = await User.login(req.body.email, req.body.password);

    if (user.status === "inactive") {
      return res.status(403).json({ message: "User not activated" });
    }
    const accessToken = createToken(user);
    const refreshToken = createRefreshToken(user);

    // store refresh token on user model
    user.refreshToken = refreshToken;
    await user.save();

    // res.cookie("accessToken", accessToken, { httpOnly: true, maxAge: 15 * 60 * 1000});
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      maxAge: 15 * 60 * 1000,
    });
    res.status(200).json({ accessToken });
  } catch (error) {
    errorHandler(error);
    res.status(500).json({ message: error.message });
  }
};

const register = async (req, res) => {
  try {
    const user = await User.signup(
      req.body.firstName,
      req.body.lastName,
      req.body.email,
      req.body.password
    );

    const accessToken = createToken(user);
    const refreshToken = createRefreshToken(user);

    // store refresh token on user model
    user.refreshToken = refreshToken;
    await user.save();

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      maxAge: 15 * 60 * 1000,
    });
    res.status(200).json({ accessToken });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const refresh = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(403).json({ message: "User not authenticated" });
    }

    const user = await User.find({ refreshToken });
    if (!user[0] || user[0]?.refreshToken !== refreshToken) {
      return res.status(403).json({ message: "User not authenticated" });
    }

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
      if (err) {
        console.log(err);
        return res.status(403).json({ message: "User not authenticated" });
      }
      const accessToken = createToken(user);
      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        maxAge: 15 * 60 * 1000,
      });
      res.status(200).json({ accessToken });
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const logout = async (req, res) => {
  // clear token
  await User.findByIdAndUpdate(req.user._id, { refreshToken: "" });

  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  res.status(200).json({ message: "Logged out" });
};

const protected = async (req, res) => {
  // check if user is authenticated
  res.status(200).json({ message: "Protected route" });
};

const resetPassword = async (req, res) => {
  // reset password using token sent to email in query
  try {
    // first decode jwt and get user id
    const decoded = jwt.verify(
      req.params.resetToken,
      process.env.REFRESH_TOKEN_SECRET
    );
    console.log(decoded._id);
    const user = await User.findById(decoded._id);
    console.log(user);
    // then update password
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
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.newPassword, salt);
    user.password = hashedPassword;
    if ( req.params.isFirstTime === 'true') {
      user.status = 'active'
    }
    await user.save();
    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    return res.status(401).json({ message: "User not authenticated" });
  }
};

module.exports = {
  login,
  register,
  refresh,
  logout,
  protected,
  resetPassword,
};

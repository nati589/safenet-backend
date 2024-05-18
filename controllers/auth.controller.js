const User = require("../models/user.model");
const jwt = require("jsonwebtoken");

const createToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" }
  );
};

const createRefreshToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );
};

const login = async (req, res) => {
  //login authentication
  try {
    const user = await User.login(req.body.email, req.body.password);
    const accessToken = createToken(user);
    const refreshToken = createRefreshToken(user);
    res.cookie("refreshToken", refreshToken, { httpOnly: true });
    res.status(200).json({ accessToken });
  } catch (error) {
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
    res.cookie("refreshToken", refreshToken, { httpOnly: true });
    res.status(200).json({ accessToken });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  login,
  register,
};

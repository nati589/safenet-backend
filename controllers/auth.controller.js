const User = require("../models/user.model");
const jwt = require("jsonwebtoken");

const createToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
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
      _id: user._id,
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
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
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
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.status(200).json({ accessToken });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const refresh = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    console.log(refreshToken)
    if (!refreshToken) {
      return res.status(403).json({ message: "User not authenticated" });
    }

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({ message: "User not authenticated" });
      }

      const accessToken = createToken(user);
      res.status(200).json({ accessToken });
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const logout = (req, res) => {
  res.clearCookie("refreshToken");
  res.status(200).json({ message: "Logged out" });
};

module.exports = {
  login,
  register,
  refresh,
  logout,
};

const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const verifyJWT = async (req, res, next) => {
  const accessToken = req.cookies.accessToken;

    if (!accessToken) {
        return res.status(401).json({ message: "Access Token Required" });
    }

    try {
        const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
        req.user = await User.findById(decoded._id);
        // const user = await User.findOne({ where: { _id: decoded._id } });
        next();
    } catch (error) {
        console.log(error);
        return res.status(401).json({ message: "User not authenticated" });
    }
};

module.exports = verifyJWT;

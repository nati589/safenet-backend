const jwt = require("jsonwebtoken");

const verifyJWT = (req, res, next) => {
  // const authHeader = req.headers.authorization || req.headers.Authorization;

  // if (!authHeader.startsWith("Bearer ")) {
  //   return res.status(401).send({ message: "Unauthorized" });
  // }


  // const token = authHeader.split(" ")[1];
  const token = req.cookies.accessToken;

  if (!token) {
    return res.status(401).send({ message: "Unauthorized" });
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.status(401).send({ message: "Forbidden1" });
    }

    req.user = user;
    next();
  });
};

module.exports = verifyJWT;

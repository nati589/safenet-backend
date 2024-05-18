require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const flowRoute = require("./routes/flow.route.js");
const userRoute = require("./routes/user.route.js");
const authRoute = require("./routes/auth.route.js");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 3500;

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to the database");
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch(() => {
    console.log("Connection failed");
  });

function authenticateToken(req, res, next) {
  const accessToken = req.headers["authorization"];
  if (!accessToken) return res.sendStatus(401);

  jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      const refreshToken = req.cookies.refreshToken;
      jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, user) => {
          if (err) return res.sendStatus(403);
          const accessToken = jwt.sign(
            {
              id: user._id,
              firstName: user.firstName,
              lastName: user.lastName,
              email: user.email,
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "15m" }
          );
          res.json({ accessToken });
        }
      );
    } else {
      req.user = user;
      next();
    }
  });
}

// routes
app.use("/api/flows", authenticateToken, flowRoute);
app.use("/api/users", authenticateToken, userRoute);
app.use("/api/auth", authRoute);

app.get("/", (req, res) => {
  res.send("Hello, world!");
});

require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const flowRoute = require("./routes/flow.route.js");
const userRoute = require("./routes/user.route.js");
const authRoute = require("./routes/auth.route.js");
const blacklistRoute = require("./routes/blacklist.route.js");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");
// const { authenticateToken } = require("./middleware/auth.middleware.js");
const verifyJWT = require("./middleware/verifyJWT.js");
const port = process.env.PORT || 3500;

// middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true
  })
);

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



// routes
app.use("/api/flows", verifyJWT, flowRoute);
app.use("/api/users", verifyJWT, userRoute);
app.use("/api/blacklist", verifyJWT, blacklistRoute);
app.use("/api/auth", authRoute);

app.get("/", (req, res) => {
  res.send("Hello, world!");
});

    // app.use(function (req, res, next) {
    //   res.setHeader("Access-Control-Allow-Origin", "*");
    //   res.setHeader("Access-Control-Allow-Credentials", "true");
    //   res.setHeader(
    //     "Access-Control-Allow-Headers",
    //     "Origin, X-Requested-With, Content-Type, Accept"
    //   );
    //   res.setHeader(
    //     "Access-Control-Allow-Methods",
    //     "GET, POST, PATCH, DELETE, OPTIONS"
    //   );
    //   next();
    //   // res.setHeader(
    //   //   "Access-Control-Allow-Headers",
    //   //   "Origin, X-Requested-With, Content-Type, Accept"
    //   // );
    //   // res.setHeader(
    //   //   "Access-Control-Allow-Methods",
    //   //   "GET, POST, PATCH, DELETE, OPTIONS"
    //   // );
    //   // next();
    // });
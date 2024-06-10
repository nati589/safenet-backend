require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const flowRoute = require("./routes/flow.route.js");
const userRoute = require("./routes/user.route.js");
const authRoute = require("./routes/auth.route.js");
const http = require("http");
const socketIo = require("socket.io");
const blacklistRoute = require("./routes/blacklist.route.js");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000", // your frontend URL
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const verifyJWT = require("./middleware/verifyJWT.js");
const Flow = require("./models/flow.model.js");
const port = process.env.PORT || 3500;

// middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to the database");
    server.listen(port, () => {
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

// Socket.IO logic
io.on("connection", (socket) => {
  console.log("New client connected");

  // Join room
  socket.on("joinRoom", async (userId) => {
    socket.join(userId);

    // Fetch flow data from your Flow model
    const flowData = await Flow.find({ userId: userId });

    // Emit each flow individually to this room
    flowData.forEach((flow) => {
      io.to(userId).emit("flowData", { flow });
    });
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
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
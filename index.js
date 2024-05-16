const express = require("express");
const mongoose = require("mongoose");
const Flow = require("./models/flow.model.js");
const flowRoute = require("./routes/flow.route.js");
const userRoute = require("./routes/user.route.js");
const app = express();
const cors = require("cors");
const port = 3000;

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

mongoose
  .connect(
    "mongodb+srv://natimok55:ZEpRc93009Xcfogm@backenddb.eeofaqw.mongodb.net/Node-API?retryWrites=true&w=majority&appName=BackendDB"
  )
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
app.use("/api/flows", flowRoute);
app.use("/api/users", userRoute);

app.get("/", (req, res) => {
  res.send("Hello, world!");
});
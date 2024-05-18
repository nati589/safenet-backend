const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/auth.controller");

//login
router.post("/login", AuthController.login);

//register
router.post("/register", AuthController.register);


module.exports = router;
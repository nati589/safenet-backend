const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/auth.controller");
const loginLimiter = require('../middleware/loginLimiter')

//login
router.post("/login", loginLimiter, AuthController.login);

//register
router.post("/register", AuthController.register);

//logout
router.post("/logout", AuthController.logout);

module.exports = router;
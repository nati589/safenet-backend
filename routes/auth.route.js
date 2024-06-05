const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/auth.controller");
const loginLimiter = require('../middleware/loginLimiter');
const verifyJWT = require("../middleware/verifyJWT");

//login
router.post("/login", loginLimiter, AuthController.login);

//register
router.post("/register", AuthController.register);

// refresh token
router.post("/refresh", AuthController.refresh);

//logout
router.post("/logout", verifyJWT, AuthController.logout);

module.exports = router;
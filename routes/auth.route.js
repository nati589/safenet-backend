const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/auth.controller");
// const loginLimiter = require('../middleware/loginLimiter');
const verifyJWT = require("../middleware/verifyJWT");

//login
router.post("/login", AuthController.login);

//register
router.post("/register", AuthController.register);

// refresh token
router.post("/refresh", AuthController.refresh);

//logout
router.post("/logout", verifyJWT, AuthController.logout);

//protected route
router.get("/protected", verifyJWT, AuthController.protected);

// reset password
router.post("/resetPassword/:resetToken/:isFirstTime", AuthController.resetPassword);

module.exports = router;
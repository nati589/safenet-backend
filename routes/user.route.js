const express = require("express");
const router = express.Router();
const UserController = require("../controllers/user.controller");

router.get("/", UserController.getUsers);
router.get("/:id", UserController.getOneUser);
router.post("/updateName", UserController.updateName);
router.post("/updatePassword", UserController.updatePassword);
router.post("/updateEmail", UserController.updateEmail);
router.post("/delete", UserController.deleteUser);


module.exports = router;
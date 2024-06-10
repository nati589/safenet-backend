const express = require("express");
const router = express.Router();
const UserController = require("../controllers/user.controller");
const verifyAdmin = require("../middleware/admin.middleware");

router.get("/", UserController.getUsers);
router.get("/admin", verifyAdmin, UserController.getAdminUsers);
router.get("/:id", UserController.getOneUser);
router.post("/createUser", verifyAdmin, UserController.createUser);
router.post("/updateName", UserController.updateName);
router.post("/updatePassword", UserController.updatePassword);
router.post("/updateEmail", UserController.updateEmail);
router.post("/delete", verifyAdmin, UserController.deleteUser);


module.exports = router;
const express = require("express");
const {
  getBlacklistByUserId,
  createBlacklistEntry,
  deleteBlacklistEntry,
} = require("../controllers/blacklist.controller");
const verifyAdmin = require("../middleware/admin.middleware");

const router = express.Router();

// GET /blacklist
router.get("/", getBlacklistByUserId);

// POST /blacklist
router.post("/", createBlacklistEntry);

// DELETE /blacklist/:id
router.delete("/:id", verifyAdmin, deleteBlacklistEntry);

module.exports = router;

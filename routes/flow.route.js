const express = require("express");
const router = express.Router();
const flowController = require("../controllers/flow.controller");
const verifyAdmin = require("../middleware/admin.middleware");

router.get("/dashboard", flowController.getDashboardFlows);
router.get("/", flowController.getFlows);
router.get("/:id", flowController.getOneFlow);
router.get("/adminFlows", verifyAdmin, flowController.fetchAdminUsersFlows);
router.post("/", flowController.createFlow);


module.exports = router;
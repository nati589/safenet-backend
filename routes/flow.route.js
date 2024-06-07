const express = require("express");
const router = express.Router();
const flowController = require("../controllers/flow.controller");

router.get("/dashboard", flowController.getDashboardFlows);
router.get("/", flowController.getFlows);
router.get("/:id", flowController.getOneFlow);
router.post("/", flowController.createFlow);


module.exports = router;
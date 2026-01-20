const express = require("express");
const applicationsController = require("../controllers/applicationsController");
const { verifyToken, checkRole } = require("../middlewares/auth");

const router = express.Router();

router.post(
  "/",
  verifyToken,
  checkRole("candidate"),
  applicationsController.applyToJob,
);
router.get("/", verifyToken, applicationsController.getApplications);

module.exports = router;

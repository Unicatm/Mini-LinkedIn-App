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
router.get(
  "/",
  verifyToken,
  checkRole("candidate"),
  applicationsController.getApplications,
);
router.get(
  "/job/:jobId",
  verifyToken,
  checkRole("recruiter"),
  applicationsController.getJobApplications,
);

module.exports = router;

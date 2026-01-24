const express = require("express");
const applicationsController = require("../controllers/applicationsController");
const { verifyToken, checkRole } = require("../middlewares/auth");
const { uploadPDF } = require("../middlewares/upload");

const router = express.Router();

router.post(
  "/",
  verifyToken,
  uploadPDF.single("file"),
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

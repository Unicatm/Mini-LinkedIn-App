const express = require("express");
const jobsController = require("../controllers/jobsController");
const { verifyToken, checkRole } = require("../middlewares/auth");

const router = express.Router();

router.get(
  "/my-jobs",
  verifyToken,
  checkRole("recruiter"),
  jobsController.getMyJobs,
);

router.get("/", verifyToken, jobsController.getAllJobs);

router.post("/", verifyToken, checkRole("recruiter"), jobsController.createJob);
router.put(
  "/:id",
  verifyToken,
  checkRole("recruiter"),
  jobsController.updateJob,
);
router.delete(
  "/:id",
  verifyToken,
  checkRole("recruiter"),
  jobsController.deleteJob,
);

module.exports = router;

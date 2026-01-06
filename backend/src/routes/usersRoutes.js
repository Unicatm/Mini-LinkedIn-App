const express = require("express");
const usersController = require("../controllers/usersController");
const { verifyToken, checkRole } = require("../middlewares/auth");
const upload = require("../middlewares/upload");

const router = express.Router();

router.get("/profile", verifyToken, usersController.getLoggedUserProfile);
router.put("/profile", verifyToken, usersController.updateProfile);

router.post(
  "/upload",
  verifyToken,
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "cover", maxCount: 1 },
    { name: "cv", maxCount: 1 },
  ]),
  usersController.uploadFile
);
router.get("/:id/public", verifyToken, usersController.getPublicProfile);

module.exports = router;

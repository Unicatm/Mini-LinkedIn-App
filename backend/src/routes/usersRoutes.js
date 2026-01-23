const express = require("express");
const usersController = require("../controllers/usersController");
const { verifyToken } = require("../middlewares/auth");
const { uploadImage } = require("../middlewares/upload");

const router = express.Router();

router.get("/profile", verifyToken, usersController.getLoggedUserProfile);
router.put("/profile", verifyToken, usersController.updateProfile);

router.post(
  "/cover",
  verifyToken,
  uploadImage.single("file"),
  usersController.uploadCover,
);
router.post(
  "/avatar",
  verifyToken,
  uploadImage.single("file"),
  usersController.uploadAvatar,
);

router.get("/:id/public", verifyToken, usersController.getPublicProfile);

module.exports = router;

const express = require("express");
const usersController = require("../controllers/usersController");
const { verifyToken, checkRole } = require("../middlewares/auth");

const router = express.Router();

router.get("/profile", verifyToken, usersController.getLoggedUserProfile);
router.put("/profile", verifyToken, usersController.updateProfile);

router.get("/:id/public", verifyToken, usersController.getPublicProfile);

module.exports = router;

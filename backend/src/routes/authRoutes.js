const express = require("express");
const authController = require("../controllers/authController");
const { verifyToken, checkRole } = require("../middlewares/auth");

const router = express.Router();

router.post("/register", authController.register);
router.post("/login", authController.login);

router.get("/profile", verifyToken, authController.getUserProfile);
router.put("/profile", verifyToken, authController.updateProfile);

module.exports = router;

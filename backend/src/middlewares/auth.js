const jwt = require("jsonwebtoken");
const db = require("../utils/dbService");

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "You're not authentificated!" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const userDoc = await db.collection("users").doc(decoded.uid).get();

    if (!userDoc.exists) {
      return res.status(401).json({ message: "Invalide user" });
    }

    req.user = {
      uid: userDoc.id,
      ...userDoc.data(),
    };
    next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid or expired token!" });
  }
};

const checkRole = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "You do not have permission." });
    }
    next();
  };
};

module.exports = { verifyToken, checkRole };

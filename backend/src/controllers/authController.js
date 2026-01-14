const db = require("../utils/dbService");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const jwtSecret = process.env.JWT_SECRET;
const jwtOptions = { expiresIn: "1d" };

exports.register = async (req, res) => {
  try {
    const { email, password, role, fullName, ...otherData } = req.body;

    if (!email || !password || !role || !fullName) {
      return res
        .status(400)
        .json({ message: "Email, password, role & fullName are required!" });
    }

    const userSnapshot = await db
      .collection("users")
      .where("email", "==", email)
      .get();
    if (!userSnapshot.empty) {
      return res.status(400).json({ message: "User already exists!" });
    }

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = {
      email,
      password: hashedPassword,
      role,
      profile: {
        fullName,
        ...(role === "recruiter"
          ? { companyName: otherData.companyName || "" }
          : { skills: otherData.skills || [] }),
      },
    };

    await db.collection("users").add(newUser);

    res.status(201).json({ message: "User successfully registered!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Enter your email and password!" });
    }

    const userSnapshot = await db
      .collection("users")
      .where("email", "==", email)
      .get();

    if (userSnapshot.empty) {
      return res.status(401).json({ message: "Incorrect email or password." });
    }

    const userDoc = userSnapshot.docs[0];
    const userData = userDoc.data();

    const isMatch = await bcrypt.compare(password, userData.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect email or password." });
    }

    const payload = {
      uid: userDoc.id,
      role: userData.role,
      email: userData.email,
    };

    const token = jwt.sign(payload, jwtSecret, jwtOptions);

    res.status(200).send({
      token,
      user: {
        uid: userDoc.id,
        email: userData.email,
        role: userData.role,
        name: userData.name,
      },
    });
  } catch (error) {
    res.status(500).send({
      message: "Error at auth",
      error: error.message,
    });
  }
};

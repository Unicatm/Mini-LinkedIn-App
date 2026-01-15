const db = require("../utils/dbService");

exports.getLoggedUserProfile = async (req, res) => {
  try {
    const { uid } = req.user;

    const userDoc = await db.collection("users").doc(uid).get();

    if (!userDoc.exists) {
      return res.status(404).json({ message: "User wasn't found!" });
    }

    const userData = userDoc.data();

    delete userData.password;

    res.status(200).json({
      uid: userDoc.id,
      ...userData,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getPublicProfile = async (req, res) => {
  try {
    const { id } = req.params;

    const userDoc = await db.collection("users").doc(id).get();

    if (!userDoc.exists) {
      return res.status(404).json({ message: "User wasn't found!" });
    }

    const userData = userDoc.data();

    const publicProfile = {
      uid: userDoc.id,
      role: userData.role,
      profile: userData.profile,
      email: userData.email,
      avatarUrl: userData.avatarUrl,
    };

    const jobsSnapshot = await db
      .collection("jobs")
      .where("recruiterId", "==", id)
      .where("status", "==", "active")
      .get();

    const jobs = jobsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.status(200).json({ user: publicProfile, jobs });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { uid } = req.user;
    const updates = req.body;

    const userRef = db.collection("users").doc(uid);

    const updateData = {};
    for (const [key, value] of Object.entries(updates)) {
      updateData[`profile.${key}`] = value;
    }

    await userRef.update(updateData);

    res.status(200).json({ message: "Profile updated succesfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

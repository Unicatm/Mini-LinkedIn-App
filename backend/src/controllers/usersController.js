const { db, bucket } = require("../utils/dbService");
const path = require("path");

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

exports.uploadFile = async (req, res) => {
  try {
    const userId = req.user.uid;

    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({ message: "No file uploaded!" });
    }

    let fileObj = null;
    let dbField = null;
    let folder = "";

    if (req.files["avatar"]) {
      fileObj = req.files["avatar"][0];
      dbField = "avatarUrl";
      folder = "avatars";
    } else if (req.files["cover"]) {
      fileObj = req.files["cover"][0];
      dbField = "coverUrl";
      folder = "covers";
    } else if (req.files["cv"]) {
      fileObj = req.files["cv"][0];
      dbField = "cvUrl";
      folder = "cvs";
    }

    if (!fileObj) {
      return res.status(400).json({ message: "No file selected" });
    }

    const userRef = db.collection("users").doc(userId);
    const userDoc = await userRef.get();
    const userData = userDoc.exists ? userDoc.data() : {};

    if (userData.profile && userData.profile[dbField]) {
      const oldUrl = userData.profile[dbField];

      try {
        const bucketUrlPrefix = `https://storage.googleapis.com/${bucket.name}/`;

        if (oldUrl.startsWith(bucketUrlPrefix)) {
          const oldFilePath = oldUrl.replace(bucketUrlPrefix, "");

          await bucket.file(oldFilePath).delete();
        }
      } catch (err) {
        console.warn("Couldn't delete old file", err.message);
      }
    }

    const fileName = `${folder}/${userId}_${Date.now()}${path.extname(
      fileObj.originalname
    )}`;

    const fileRef = bucket.file(fileName);

    await fileRef.save(fileObj.buffer, {
      metadata: { contentType: fileObj.mimetype },
      public: true,
    });

    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;

    await userRef.update({
      [`profile.${dbField}`]: publicUrl,
      updatedAt: new Date(),
    });

    res.status(200).json({
      message: "Succes uploaded!",
      url: publicUrl,
      type: dbField,
    });
  } catch (error) {
    console.error("Error at Upload:", error);
    res.status(500).json({ error: error.message });
  }
};

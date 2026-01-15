const db = require("../utils/dbService");

exports.createJob = async (req, res) => {
  try {
    const { title, description, salary, type } = req.body;

    if (!title && !description) {
      return res
        .status(400)
        .json({ message: "Title and description missing!" });
    }

    const newJob = {
      recruiterId: req.user?.uid || 1233,
      title,
      description,
      salary,
      type,
      companySnapshot: {
        name: req.user.profile?.companyName || "Company Name",
      },
      createdAt: new Date(),
      status: "active",
    };

    const docRef = await db.collection("jobs").add(newJob);
    res
      .status(201)
      .json({ id: docRef.id, message: "Job posted successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getMyJobs = async (req, res) => {
  try {
    const snapshot = await db
      .collection("jobs")
      .where("recruiterId", "==", req.user.uid)
      .get();

    const jobs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllJobs = async (req, res) => {
  try {
    const snapshot = await db
      .collection("jobs")
      .where("status", "==", "active")
      .get();

    const jobs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteJob = async (req, res) => {
  try {
    const { id } = req.params;
    const jobRef = db.collection("jobs").doc(id);
    const doc = await jobRef.get();

    if (!doc.exists) {
      return res.status(404).json({ message: "The job does not exist." });
    }

    if (doc.data().recruiterId !== req.user.uid) {
      return res
        .status(403)
        .json({ message: "You do not have the permision to delete this job." });
    }

    await jobRef.delete();
    res.status(200).json({ message: "Job was deleted." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

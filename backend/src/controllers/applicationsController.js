const { db, bucket } = require("../utils/dbService");

exports.applyToJob = async (req, res) => {
  try {
    const { jobId } = req.body;
    const candidateId = req.user.uid;

    if (req.user.role != "candidate") {
      return res
        .status(403)
        .json({ message: "Recruiters can't apply for jobs!" });
    }

    const existingApp = await db
      .collection("applications")
      .where("jobId", "==", jobId)
      .where("candidateId", "==", candidateId)
      .get();

    if (!existingApp.empty) {
      return res
        .status(400)
        .json({ message: "You have already applied for this job!" });
    }

    const jobDoc = await db.collection("jobs").doc(jobId).get();
    const jobData = jobDoc.data();

    const application = {
      jobId,
      candidateId,
      recruiterId: jobData.recruiterId,
      status: "pending",
      jobSnapshot: {
        title: jobData.title,
        companyName: jobData.companySnapshot.name,
        type: jobData.type,
      },
      candidateSnapshot: {
        name: req.user.profile?.fullName || "Anonim",
        email: req.user.email,
      },
      appliedAt: new Date(),
    };

    await db.collection("applications").add(application);
    res.status(201).json({ message: "Successfully applied!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

exports.getJobApplications = async (req, res) => {
  try {
    const { jobId } = req.params;
    const recruiterId = req.user.uid;

    const jobDoc = await db.collection("jobs").doc(jobId).get();
    if (!jobDoc.exists || jobDoc.data().recruiterId !== recruiterId) {
      return res
        .status(403)
        .json({ message: "Not authorized to view these applications." });
    }

    const snapshot = await db
      .collection("applications")
      .where("jobId", "==", jobId)
      .get();

    const applications = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getApplications = async (req, res) => {
  try {
    let query = db
      .collection("applications")
      .where("candidateId", "==", req.user.uid);

    const snapshot = await query.get();
    const applications = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

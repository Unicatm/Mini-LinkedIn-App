const { db, bucket } = require("../utils/dbService");

const uploadFileHelper = async (req, res, folderName, dbField) => {
  try {
    const file = req.file;
    const userId = req.user.uid;

    if (!file) {
      return res.status(400).json({ message: "No file provided." });
    }

    const userDoc = await db.collection("users").doc(userId).get();
    if (userDoc.exists) {
      const userData = userDoc.data();

      let oldUrl = null;
      if (userData.profile && userData.profile[dbField]) {
        oldUrl = userData.profile[dbField];
      }

      if (oldUrl) {
        await deleteOldFile(oldUrl);
      }
    }

    const fileName = `${folderName}/${userId}_${Date.now()}_${file.originalname}`;
    const fileUpload = bucket.file(fileName);

    const blobStream = fileUpload.createWriteStream({
      metadata: {
        contentType: file.mimetype,
      },
    });

    blobStream.on("error", (error) => {
      console.error(error);
      return res.status(500).json({ message: "Upload error." });
    });

    blobStream.on("finish", async () => {
      const [url] = await fileUpload.getSignedUrl({
        action: "read",
        expires: "01-01-2050",
      });

      await db
        .collection("users")
        .doc(userId)
        .update({
          [`profile.${dbField}`]: url,
        });

      res.status(200).json({ message: "Upload successful", url: url });
    });

    blobStream.end(file.buffer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

const deleteOldFile = async (fileUrl) => {
  if (!fileUrl) return;

  try {
    const urlObj = new URL(fileUrl);
    const fullPath = decodeURIComponent(urlObj.pathname);

    const bucketName = bucket.name;
    let filePath = fullPath;

    if (fullPath.includes(bucketName)) {
      filePath = fullPath.substring(
        fullPath.indexOf(bucketName) + bucketName.length + 1,
      );
    }

    if (filePath.startsWith("/")) {
      filePath = filePath.substring(1);
    }

    const file = bucket.file(filePath);

    const [exists] = await file.exists();
    if (exists) {
      await file.delete();
    }
  } catch (error) {
    console.error("Error deleting old file:", error.message);
  }
};

module.exports = uploadFileHelper;

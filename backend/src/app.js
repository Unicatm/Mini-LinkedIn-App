const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());

const jobsRoutes = require("./routes/jobsRoutes");
const applicationsRoutes = require("./routes/applicationsRoutes");
const authRoutes = require("./routes/authRoutes");

app.use("/api/auth", authRoutes);

app.use("/api/jobs", jobsRoutes);
app.use("/api/applications", applicationsRoutes);

module.exports = app;

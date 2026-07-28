const express = require("express");
const app = express();
const auth = require("../middleware/auth");
const { isRecruiter } = require("../middleware/role");
const {
  createJob,
  getAllJobs,
  getJobById,
  updateJob,
  archiveJob,
} = require("../controllers/jobController");

/* Protected - Recruiter Routes */
app.post("/", auth, isRecruiter, createJob);
app.put("/:id", auth, isRecruiter, updateJob);
app.patch("/:id/archive", auth, isRecruiter, archiveJob);

/* Public -Applicant routes */
app.get("/", getAllJobs);
app.get("/:id", getJobById);

module.exports = app;

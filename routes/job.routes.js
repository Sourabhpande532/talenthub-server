const express = require("express");
const app = express();
const auth = require("../middleware/auth");
const { isRecruiter } = require("../middleware/role");
const {
  createJob,
  getAllJobs,
  getJobById,
} = require("../controllers/jobController");

/* Recruiter Routes */
app.post("/", auth, isRecruiter, createJob);
module.exports = app;

/* Public- Applicant routes */
app.get("/", getAllJobs);
app.get("/:id", getJobById);

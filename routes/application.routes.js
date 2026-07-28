const express = require("express");
const app = express();
const auth = require("../middleware/auth");
const { isRecruiter, isApplicant } = require("../middleware/role");
const {
  applyJob,
  getJobApplicants,
  withdrawApplication,
  updateApplicationStatus,
} = require("../controllers/applicationController");

/* Applicant Routes */
app.post("/apply", auth, isApplicant, applyJob);
app.delete("/:id/withdraw", auth, isApplicant, withdrawApplication);

/* Recruiter Routes */
app.get("/job/:jobId", auth, isRecruiter, getJobApplicants);
app.patch("/:id/status", auth, isRecruiter, updateApplicationStatus);

module.exports = app;

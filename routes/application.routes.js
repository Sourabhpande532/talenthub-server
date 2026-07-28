const express = require("express");
const app = express();
const auth = require("../middleware/auth");
const { isRecruiter, isApplicant } = require("../middleware/role");
const { applyJob, getJobApplicants } = require("../controllers/applicationController");

/* Applicant Routes */
app.post("/apply", auth, isApplicant, applyJob);

/* Recruiter Routes */
app.get("/job/:jobId", auth, isRecruiter, getJobApplicants);

module.exports = app;

const express = require("express");
const app = express();
const auth = require("../middleware/auth");
const { isRecruiter, isApplicant } = require("../middleware/role");
const { applyJob } = require("../controllers/applicationController");

/* Applicant Routes */
app.post("/apply", auth, isApplicant, applyJob);

module.exports = app;

const express = require("express");
const app = express();
const auth = require("../middleware/auth");
const { isApplicant, isRecruiter } = require("../middleware/role");
const {
  generateInterviewPrep,
  askHiringAssistant,
  generateJobDescription,
} = require("../controllers/aiController");

/* Applicant: AI Interview Prep */
app.post("/interview-prep", auth, isApplicant, generateInterviewPrep);

/* Recruiter: AI Hiring Assistant */
app.post("/hiring-assistant", auth, isRecruiter, askHiringAssistant);

/* Recruiter: AI Job Description Generator (Bonus)*/
app.post(
  "/generate-job-description",
  auth,
  isRecruiter,
  generateJobDescription,
);

module.exports = app;

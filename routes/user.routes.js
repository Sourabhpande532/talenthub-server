const express = require("express");
const app = express();
const auth = require("../middleware/auth");
const { getProfile } = require("../controllers/userController");

/* Profile routes (Both Applicant and Recruiter) */
app.get("/profile", auth, getProfile);

module.exports = app;

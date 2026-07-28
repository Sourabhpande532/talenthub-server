const express = require("express");
const app = express();
const auth = require("../middleware/auth");
const { getProfile, updateProfile } = require("../controllers/userController");

/* Profile routes (Both Applicant and Recruiter) */
app.get("/profile", auth, getProfile);
app.put("/profile", auth, updateProfile);

module.exports = app;

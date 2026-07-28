const express = require("express");
const app = express();
const auth = require("../middleware/auth");
const {
  getProfile,
  updateProfile,
  addBookmark,
} = require("../controllers/userController");
const { isApplicant } = require("../middleware/role");

/* Profile routes (Both Applicant and Recruiter) */
app.get("/profile", auth, getProfile);
app.put("/profile", auth, updateProfile);

/* Applicant Bookmark routes */
app.post("/bookmarks", auth, isApplicant, addBookmark);

module.exports = app;

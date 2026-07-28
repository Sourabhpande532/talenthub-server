const express = require("express");
const app = express();
const auth = require("../middleware/auth");
const {
  getProfile,
  updateProfile,
  addBookmark,
  removeBookmark,
} = require("../controllers/userController");
const { isApplicant } = require("../middleware/role");

/* Profile routes (Both Applicant and Recruiter) */
app.get("/profile", auth, getProfile);
app.put("/profile", auth, updateProfile);

/* Applicant Bookmark routes */
app.post("/bookmarks", auth, isApplicant, addBookmark);
app.delete("/bookmarks/:jobId", auth, isApplicant, removeBookmark)

/* Recruiter Dashboard route */

module.exports = app;

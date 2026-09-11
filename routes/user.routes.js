const express = require("express");
const app = express();
const auth = require("../middleware/auth");
const {
  getProfile,
  updateProfile,
  addBookmark,
  removeBookmark,
  dashboardHandler,
} = require("../controllers/userController");
const { isApplicant, isRecruiter } = require("../middleware/role");

/* Profile routes (Both Applicant and Recruiter) */
app.get("/profile", auth, getProfile);
app.put("/profile", auth, updateProfile);

/* Applicant Bookmark routes */
app.post("/bookmarks", auth, isApplicant, addBookmark);
app.delete("/bookmarks/:jobId", auth, isApplicant, removeBookmark);

/* Recruiter Dashboard (Handles Both) */
app.get("/dashboard", auth, dashboardHandler);

module.exports = app;

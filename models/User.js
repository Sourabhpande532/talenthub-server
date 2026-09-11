const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    role: {
      type: String,
      enum: ["Applicant", "Recruiter"],
      default: "Applicant",
    },
    /* Applicant */
    photo: { type: String, default: "" },
    bio: { type: String, default: "" },
    experience: { type: String, default: "" },
    education: { type: String, default: "" },
    skills: { type: [String], default: [] },
    resume: { type: String, default: "" },
    bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Job" }],
    /*  Recruiter */
    companyName: { type: String, default: "" },
    companyLogo: { type: String, default: "" },
    website: { type: String, default: "" },
    aboutCompany: { type: String, default: "" },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);
module.exports = mongoose.model("User", userSchema);

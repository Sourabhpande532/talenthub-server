const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    company: { type: String, required: true },
    salary: { type: Number, required: true },
    experience: { type: String, required: true },
    location: { type: String, required: true },
    employmentType: { type: String, required: true },
    remote: { type: Boolean, default: false },
    description: { type: String, required: true },
    skills: { type: [String], default: [] },
    recruiter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    deadline: { type: Date, required: true },
    status: {
      type: String,
      enum: ["Active", "Archived"],
      default: "Active",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Job", jobSchema);

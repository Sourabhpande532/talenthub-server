const Application = require("../models/Application");
const Job = require("../models/Job");

const createApplicationInDB = async (applicationData) => {
  try {
    return await Application.create(applicationData);
  } catch (error) {
    throw error;
  }
};

exports.applyJob = async (req, res) => {
  try {
    const { jobId, resume } = req.body;

    // Check if job exists
    const job = await Job.findById(jobId);
    if (!job || job.status === "Archived") {
      return res
        .status(404)
        .json({ success: false, message: "Job not found or unavailable" });
    }

    // Check if already applied
    const existingApplication = await Application.findOne({
      job: jobId,
      applicant: req.user.userId,
    });

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: "You have already applied for this job",
      });
    }

    const application = await createApplicationInDB({
      applicant: req.user.userId,
      job: jobId,
      resume: resume || "",
    });

    res.status(201).json({
      success: true,
      message: "Applied successfully",
      data: application,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const Application = require("../models/Application");
const Job = require("../models/Job");

const getApplicationsByJobId = async (jobId, recruiterId) => {
  try {
    // First, verify the job belongs to the recruiter
    const job = await Job.findOne({ _id: jobId, recruiter: recruiterId });
    if (!job) {
      return null;
    }
    return await Application.find({ job: jobId }).populate(
      "applicant",
      "name email photo experience skills education resume",
    );
  } catch (error) {
    throw error;
  }
};

exports.getJobApplicants = async (req, res) => {
  try {
    const applications = await getApplicationsByJobId(
      req.params.jobId,
      req.user.userId,
    );
    if (!applications) {
      return res
        .status(403)
        .json({ success: false, message: "Unauthorized or job not found" });
    }
    res
      .status(200)
      .json({ success: true, count: applications.length, data: applications });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

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

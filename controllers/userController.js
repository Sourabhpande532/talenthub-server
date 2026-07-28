const User = require("../models/User");
const Job = require("../models/Job");
const Application = require("../models/Application");

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
      .select("-password")
      .populate("bookmarks");
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const {
      name,
      photo,
      bio,
      experience,
      education,
      skills,
      companyName,
      companyLogo,
      website,
      aboutCompany,
    } = req.body;

    const updateData = {};
    if (name) updateData.name = name;

    if (req.user.role === "Applicant") {
      if (photo !== undefined) updateData.photo = photo;
      if (bio !== undefined) updateData.bio = bio;
      if (experience !== undefined) updateData.experience = experience;
      if (education !== undefined) updateData.education = education;
      if (skills !== undefined) updateData.skills = skills;
    } else if (req.user.role === "Recruiter") {
      if (companyName !== undefined) updateData.companyName = companyName;
      if (companyLogo !== undefined) updateData.companyLogo = companyLogo;
      if (website !== undefined) updateData.website = website;
      if (aboutCompany !== undefined) updateData.aboutCompany = aboutCompany;
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.userId,
      updateData,
      { new: true },
    ).select("-password");

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.addBookmark = async (req, res) => {
  try {
    const { jobId } = req.body;

    // Check if job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { $addToSet: { bookmarks: jobId } }, // Prevent duplicates
      { new: true },
    )
      .select("-password")
      .populate("bookmarks");

    res
      .status(200)
      .json({ success: true, message: "Job bookmarked", data: user });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

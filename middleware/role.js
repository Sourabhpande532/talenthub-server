const isRecruiter = (req, res, next) => {
  if (req.user && req.user.role === "Recruiter") {
    next();
  } else {
    res
      .status(403)
      .json({ success: false, message: "Access denied. Recruiters only." });
  }
};

const isApplicant = (req, res, next) => {
  if (req.user && req.user.role === "Applicant") {
    next();
  } else {
    res
      .status(403)
      .json({ success: false, message: "Access denied. Applicants only." });
  }
};

module.exports = { isRecruiter, isApplicant };

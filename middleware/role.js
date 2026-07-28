const isRecruiter = (req, res, next) => {
  if (req.user && req.user.role === "Recruiter") {
    next();
  } else {
    res.status(403).json({ success: false, message: "Access denied. Recruiters only." });
  }
};
module.exports = {isRecruiter}
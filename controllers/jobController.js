const Job = require("../models/Job");

const getJobsFromDB = async (filters, sortOption) => {
  try {
    return await Job.find(filters)
      .sort(sortOption)
      .populate("recruiter", "companyName companyLogo");
  } catch (error) {
    throw error;
  }
};

exports.getAllJobs = async (req, res) => {
  try {
    const {
      search,
      location,
      salary,
      experience,
      employmentType,
      remote,
      sort,
    } = req.query;

    // Build filters
    const filters = { status: "Active" };
    if (search && search.trim()) {
      const searchRegex = { $regex: search.trim(), $options: "i" };
      filters.$or = [
        { title: searchRegex },
        { company: searchRegex },
        { skills: searchRegex },
        { location: searchRegex },
        { description: searchRegex },
      ];
    }
    if (location && location.trim()) {
      if (location.toLowerCase() === "remote") {
        const remoteCond = [
          { location: { $regex: "remote", $options: "i" } },
          { remote: true },
        ];
        if (filters.$or) {
          filters.$and = [{ $or: filters.$or }, { $or: remoteCond }];
          delete filters.$or;
        } else {
          filters.$or = remoteCond;
        }
      } else if (
        location.toLowerCase() === "bangalore" ||
        location.toLowerCase() === "bengaluru"
      ) {
        filters.location = {
          $regex: "Bangalore|Bengaluru|Banglore|Bangolore",
          $options: "i",
        };
      } else {
        filters.location = { $regex: location.trim(), $options: "i" };
      }
    }
    if (salary) {
      filters.salary = { $gte: Number(salary) };
    }
    if (experience && experience.trim()) {
      filters.experience = experience.trim();
    }
    if (employmentType && employmentType.trim()) {
      const empTypeRegex = employmentType.trim().replace("-", "[ -]?");
      filters.employmentType = { $regex: empTypeRegex, $options: "i" };
    }
    if (remote) {
      filters.remote = remote === "true";
    }

    // Build sort option
    let sortOption = { createdAt: -1 };
    if (sort === "salary-desc") {
      sortOption = { salary: -1 };
    } else if (sort === "salary-asc") {
      sortOption = { salary: 1 };
    } else if (sort === "oldest") {
      sortOption = { createdAt: 1 };
    } else {
      sortOption = { createdAt: -1 };
    }

    const jobs = await getJobsFromDB(filters, sortOption);
    res.status(200).json({ success: true, count: jobs.length, data: jobs });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const createJobInDB = async (jobData) => {
  try {
    return await Job.create(jobData);
  } catch (error) {
    throw error;
  }
};
exports.createJob = async (req, res) => {
  try {
    const jobData = { ...req.body, recruiter: req.user.userId };
    if (
      !jobData.title ||
      !jobData.company ||
      !jobData.salary ||
      !jobData.deadline
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }
    if (jobData.salary <= 0) {
      return res
        .status(400)
        .json({ success: false, message: "Salary must be greater than 0" });
    }
    if (new Date(jobData.deadline) < new Date()) {
      return res
        .status(400)
        .json({ success: false, message: "Deadline cannot be in the past" });
    }

    const job = await createJobInDB(jobData);
    res
      .status(201)
      .json({ success: true, message: "Job created successfully", data: job });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const getJobByIdFromDB = async (jobId) => {
  try {
    return await Job.findById(jobId).populate(
      "recruiter",
      "name email companyName companyLogo website aboutCompany",
    );
  } catch (error) {
    throw error;
  }
};
exports.getJobById = async (req, res) => {
  try {
    const job = await getJobByIdFromDB(req.params.id);
    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    /*  Fetch similar jobs based on title or skills */
    const similarJobs = await Job.find({
      _id: { $ne: job._id },
      status: "Active",
      $or: [
        { title: { $regex: job.title.split(" ")[0], $options: "i" } },
        { skills: { $in: job.skills } },
      ],
    }).limit(3);

    res.status(200).json({ success: true, data: { job, similarJobs } });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const updateJobInDB = async (jobId, recruiterId, updateData) => {
  try {
    return await Job.findOneAndUpdate(
      { _id: jobId, recruiter: recruiterId },
      updateData,
      { new: true },
    );
  } catch (error) {
    throw error;
  }
};

exports.updateJob = async (req, res) => {
  try {
    const job = await updateJobInDB(req.params.id, req.user.userId, req.body);
    if (!job) {
      return res
        .status(404)
        .json({ success: false, message: "Job not found or unauthorized" });
    }
    res
      .status(200)
      .json({ success: true, message: "Job updated successfully", data: job });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const archiveJobInDB = async (jobId, recruiterId) => {
  try {
    return await Job.findOneAndUpdate(
      { _id: jobId, recruiter: recruiterId },
      { status: "Archived" },
      { new: true },
    );
  } catch (error) {
    throw error;
  }
};

exports.archiveJob = async (req, res) => {
  try {
    const job = await archiveJobInDB(req.params.id, req.user.userId);
    if (!job) {
      return res
        .status(404)
        .json({ success: false, message: "Job not found or unauthorized" });
    }
    res
      .status(200)
      .json({ success: true, message: "Job archived successfully", data: job });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const dns = require("dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);
require("dotenv").config({ path: "./.env" });
const mongoose = require("mongoose");
const Job = require("../models/Job");
const User = require("../models/User");

const seedJobs = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL, { dbName: "mcr_fsp_main" });
    console.log("Connected to DB for seeding and cleaning");

    // 1. Fix existing user spellings
    await User.updateMany(
      { companyName: "Acenture Pvt Ltd" },
      { $set: { companyName: "Accenture" } }
    );
    await User.updateMany(
      { name: "Acenture" },
      { $set: { name: "Accenture", companyName: "Accenture" } }
    );

    // 2. Fix existing job spellings and skills
    await Job.updateMany(
      { company: "Infosis" },
      { $set: { company: "Infosys" } }
    );
    await Job.updateMany(
      { company: "Acenture" },
      { $set: { company: "Accenture" } }
    );
    await Job.updateMany(
      { company: "Github" },
      { $set: { company: "GitHub" } }
    );
    await Job.updateMany(
      { location: { $in: ["Bangolore", "Banglore"] } },
      { $set: { location: "Bangalore" } }
    );

    // Fix malformed single-string skills in existing jobs
    const allExistingJobs = await Job.find({});
    for (const job of allExistingJobs) {
      let changed = false;
      const cleanSkills = [];
      for (const skill of job.skills) {
        if (skill.includes(" ")) {
          // Check if it's like 'Node.js JavaScript'
          const parts = skill.split(/\s+/).filter(Boolean);
          if (parts.length > 1 && !skill.toLowerCase().includes("tailwind css") && !skill.toLowerCase().includes("content writer") && !skill.toLowerCase().includes("auto card")) {
            cleanSkills.push(...parts);
            changed = true;
            continue;
          }
        }
        cleanSkills.push(skill.replace(/,$/, "").trim());
      }
      if (changed || cleanSkills.some((s, idx) => s !== job.skills[idx])) {
        job.skills = cleanSkills;
        await job.save();
      }
    }

    // Get an existing recruiter ID
    let recruiter = await User.findOne({ role: "Recruiter" });
    if (!recruiter) {
      recruiter = await User.create({
        name: "Talent Acquisition Lead",
        email: "recruiter@talenthub.com",
        password: "password123",
        role: "Recruiter",
        companyName: "TalentHub Global",
      });
    }
    const recruiterId = recruiter._id;

    // Additional realistic jobs
    const newJobsData = [
      {
        title: "Frontend Engineer (React / TypeScript)",
        company: "Google",
        salary: 24,
        experience: "3-5 Yrs",
        location: "Bangalore",
        employmentType: "Full-time",
        remote: false,
        description: "Join Google's Core Developer Platforms team to build high-performance, accessible web applications using React, TypeScript, and modern frontend architecture. You will collaborate with design, product, and backend engineering teams.",
        skills: ["React", "TypeScript", "Redux", "HTML5", "CSS3", "Jest"],
        recruiter: recruiterId,
        deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        status: "Active",
      },
      {
        title: "Full Stack Developer",
        company: "Microsoft",
        salary: 22,
        experience: "3-5 Yrs",
        location: "Hyderabad",
        employmentType: "Full-time",
        remote: false,
        description: "We are seeking a talented Full Stack Developer to help build cloud-scale web services and intuitive client interfaces for Microsoft Azure portal components using Node.js, React, and Azure Cosmos DB.",
        skills: ["React", "Node.js", "TypeScript", "Azure", "MongoDB", "REST APIs"],
        recruiter: recruiterId,
        deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
        status: "Active",
      },
      {
        title: "Software Development Engineer - Backend",
        company: "Amazon",
        salary: 28,
        experience: "5+ Yrs",
        location: "Bangalore",
        employmentType: "Full-time",
        remote: false,
        description: "Amazon is looking for experienced backend software engineers to design, build, and deploy low-latency distributed microservices handling millions of transactions daily across global retail services.",
        skills: ["Java", "Spring Boot", "AWS", "Microservices", "Docker", "SQL"],
        recruiter: recruiterId,
        deadline: new Date(Date.now() + 50 * 24 * 60 * 60 * 1000),
        status: "Active",
      },
      {
        title: "Associate Software Engineer",
        company: "Infosys",
        salary: 6,
        experience: "Fresher",
        location: "Pune",
        employmentType: "Full-time",
        remote: false,
        description: "Great opportunity for fresh engineering graduates to begin their IT career at Infosys. You will receive extensive training in modern software engineering principles, Java/Python, database design, and cloud fundamentals.",
        skills: ["Java", "Python", "SQL", "Git", "Data Structures"],
        recruiter: recruiterId,
        deadline: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        status: "Active",
      },
      {
        title: "Cloud DevOps Engineer",
        company: "Accenture",
        salary: 16,
        experience: "3-5 Yrs",
        location: "Mumbai",
        employmentType: "Full-time",
        remote: false,
        description: "Accenture Cloud First practice is hiring a DevOps Engineer to design CI/CD pipelines, automate infrastructure as code using Terraform, and manage Kubernetes clusters across hybrid multi-cloud environments.",
        skills: ["Kubernetes", "Docker", "AWS", "Terraform", "CI/CD", "Linux"],
        recruiter: recruiterId,
        deadline: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000),
        status: "Active",
      },
      {
        title: "Remote Full Stack Engineer",
        company: "GitHub",
        salary: 32,
        experience: "5+ Yrs",
        location: "Remote",
        employmentType: "Full-time",
        remote: true,
        description: "Join GitHub's remote-first engineering team working on developer collaboration features. Build resilient web services with Ruby on Rails, Go, React, and TypeScript supporting millions of open source and enterprise developers.",
        skills: ["React", "TypeScript", "Go", "Ruby", "GraphQL", "Git"],
        recruiter: recruiterId,
        deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        status: "Active",
      },
      {
        title: "Junior Frontend Developer",
        company: "Swiggy",
        salary: 10,
        experience: "1-3 Yrs",
        location: "Bangalore",
        employmentType: "Full-time",
        remote: false,
        description: "Swiggy is looking for a passionate Junior Frontend Developer to build fast, responsive mobile-first web pages for Swiggy Instamart and Food Delivery consumer portals.",
        skills: ["React", "JavaScript", "CSS3", "Tailwind CSS", "Redux Toolkit"],
        recruiter: recruiterId,
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        status: "Active",
      },
      {
        title: "Backend Engineer (Python / FastAPI)",
        company: "Zomato",
        salary: 18,
        experience: "3-5 Yrs",
        location: "Delhi NCR",
        employmentType: "Full-time",
        remote: false,
        description: "Build high-throughput order dispatch and restaurant tracking microservices at Zomato. You will work with Python, FastAPI, Redis, Kafka, and PostgreSQL to ensure millisecond-level responsiveness.",
        skills: ["Python", "FastAPI", "PostgreSQL", "Redis", "Kafka", "Docker"],
        recruiter: recruiterId,
        deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
        status: "Active",
      },
      {
        title: "Software Engineering Intern",
        company: "Razorpay",
        salary: 5,
        experience: "Fresher",
        location: "Bangalore",
        employmentType: "Internship",
        remote: false,
        description: "6-month software engineering internship for final-year students and fresh graduates. Work directly with fintech engineering teams building payment gateway integrations, developer SDKs, and analytics dashboards.",
        skills: ["JavaScript", "Node.js", "React", "REST APIs", "SQL"],
        recruiter: recruiterId,
        deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        status: "Active",
      },
      {
        title: "Senior Product Designer (UI/UX)",
        company: "Flipkart",
        salary: 20,
        experience: "5+ Yrs",
        location: "Bangalore",
        employmentType: "Full-time",
        remote: false,
        description: "Lead product design initiatives for Flipkart eCommerce checkout and payment flows. Create wireframes, interactive prototypes, conduct user research, and maintain comprehensive design system components in Figma.",
        skills: ["Figma", "UI/UX Design", "Wireframing", "Prototyping", "Design Systems"],
        recruiter: recruiterId,
        deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
        status: "Active",
      },
      {
        title: "Contract React Native Mobile Developer",
        company: "Atlassian",
        salary: 15,
        experience: "3-5 Yrs",
        location: "Remote",
        employmentType: "Contract",
        remote: true,
        description: "6-month contract role building cross-platform Jira and Confluence companion mobile apps using React Native, TypeScript, and modern mobile architectural patterns.",
        skills: ["React Native", "TypeScript", "Redux", "iOS", "Android"],
        recruiter: recruiterId,
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        status: "Active",
      },
      {
        title: "Junior Data Analyst",
        company: "Wipro",
        salary: 7,
        experience: "1-3 Yrs",
        location: "Hyderabad",
        employmentType: "Full-time",
        remote: false,
        description: "Work with global enterprise clients to extract, clean, and visualize business performance metrics. Build interactive PowerBI and Tableau dashboards and execute complex SQL data queries.",
        skills: ["SQL", "Python", "Tableau", "Excel", "Data Analysis"],
        recruiter: recruiterId,
        deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        status: "Active",
      },
      {
        title: "Part-time Technical Writer",
        company: "Adobe",
        salary: 8,
        experience: "1-3 Yrs",
        location: "Remote",
        employmentType: "Part-time",
        remote: true,
        description: "Create clear, engaging developer documentation, API guides, and code walkthroughs for Adobe Developer Ecosystem. Flexible part-time hours with 20 hours per week commitment.",
        skills: ["Technical Writing", "Markdown", "Git", "JavaScript", "API Documentation"],
        recruiter: recruiterId,
        deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        status: "Active",
      },
      {
        title: "Senior Node.js Backend Architect",
        company: "Stripe",
        salary: 35,
        experience: "5+ Yrs",
        location: "Bangalore",
        employmentType: "Full-time",
        remote: true,
        description: "Design and scale critical payment processing backends. Strong expertise required in Node.js, asynchronous event-driven architectures, distributed transactions, Redis, and high availability systems.",
        skills: ["Node.js", "TypeScript", "Microservices", "PostgreSQL", "Redis", "Kafka", "AWS"],
        recruiter: recruiterId,
        deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        status: "Active",
      },
      {
        title: "QA Automation Engineer",
        company: "Capgemini",
        salary: 11,
        experience: "3-5 Yrs",
        location: "Chennai",
        employmentType: "Full-time",
        remote: false,
        description: "Develop automated test suites using Cypress, Selenium, and Playwright for enterprise web applications. Maintain CI/CD automated test reporting pipelines.",
        skills: ["Cypress", "Selenium", "JavaScript", "Playwright", "CI/CD", "Jest"],
        recruiter: recruiterId,
        deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
        status: "Active",
      },
      {
        title: "AI / Machine Learning Engineer",
        company: "Sarvam AI",
        salary: 26,
        experience: "3-5 Yrs",
        location: "Bangalore",
        employmentType: "Full-time",
        remote: false,
        description: "Develop generative AI models, fine-tune LLMs for Indian languages, and build production inference pipelines using PyTorch, HuggingFace, FastAPI, and GPU acceleration.",
        skills: ["Python", "PyTorch", "HuggingFace", "LLMs", "FastAPI", "Docker"],
        recruiter: recruiterId,
        deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        status: "Active",
      }
    ];

    for (const jobData of newJobsData) {
      const exists = await Job.findOne({ title: jobData.title, company: jobData.company });
      if (!exists) {
        await Job.create(jobData);
        console.log(`Created job: ${jobData.title} at ${jobData.company}`);
      } else {
        console.log(`Job already exists: ${jobData.title} at ${jobData.company}`);
      }
    }

    const totalJobs = await Job.countDocuments();
    console.log(`\nSeeding completed successfully! Total jobs in database: ${totalJobs}`);

    await mongoose.disconnect();
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  }
};

seedJobs();

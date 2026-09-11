const OpenAI = require("openai");
const Job = require("../models/Job");
const Application = require("../models/Application");

// Initialize OpenAI client with OpenRouter configuration
const apiKey = process.env.OPENAI_API_KEY || "dummy_key";
const baseURL = apiKey.startsWith("sk-or-")
  ? "https://openrouter.ai/api/v1"
  : "https://api.openai.com/v1";
const modelName = apiKey.startsWith("sk-or-")
  ? "openai/gpt-4o-mini"
  : "gpt-4o-mini";

const openai = new OpenAI({ apiKey, baseURL });

let temperature = 0.2;
let max_tokens_small = 80;
let max_tokens_mid = 240;
let max_tokens_large = 800;

exports.generateInterviewPrep = async (req, res) => {
  try {
    const { jobId } = req.body;

    // RAG: Retrieve relevant job context
    const job = await Job.findById(jobId).populate("recruiter", "companyName");
    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    const companyName = job.company || job.companyName || job.recruiter?.companyName || "Unknown Company";
    const systemPrompt = `You are an expert AI Interview Preparation Assistant.
Generate preparation material for a candidate applying for the following job:
Title: ${job.title || "Unknown Title"}
Company: ${companyName}
Experience Required: ${job.experience || "Not specified"}
Description: ${job.description || "Not specified"}
Skills: ${job.skills ? job.skills.join(", ") : "Not specified"}

Your output must be formatted exactly like this:
Interview Questions

1. [Question 1]
2. [Question 2]
3. [Question 3]
4. [Question 4]
5. [Question 5]

Topics to Revise

- [Topic 1]
- [Topic 2]
- [Topic 3]

Preparation Tips

[Provide 1-2 paragraphs of actionable preparation tips focusing on the job requirements.]`;

    const userPrompt = "Please generate my interview preparation material.";

    const response = await openai.chat.completions.create({
      model: modelName,
      temperature: 0.7, // For creativity Question
      max_tokens: max_tokens_large,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    });
    res
      .status(200)
      .json({ success: true, data: response.choices[0].message.content });
  } catch (error) {
    console.error("AI Error:", error.message);
    res.status(500).json({
      success: false,
      message: "AI service is currently unavailable. Please try again later.",
    });
  }
};

exports.askHiringAssistant = async (req, res) => {
  try {
    const { jobId, question } = req.body;

    // RAG: Retrieve applications for this job
    const job = await Job.findOne({ _id: jobId, recruiter: req.user.userId });
    if (!job) {
      return res
        .status(403)
        .json({ success: false, message: "Unauthorized or job not found" });
    }

    const applications = await Application.find({ job: jobId }).populate(
      "applicant",
      "name email experience skills education",
    );

    // Map data to a concise JSON format for context
    const applicantsContext = applications.map((app) => ({
      name: app.applicant.name,
      experience: app.applicant.experience,
      skills: app.applicant.skills,
      education: app.applicant.education,
      status: app.status,
    }));

    const systemPrompt = `You are an expert AI Hiring Assistant helping a recruiter make decisions.
Answer the recruiter's question based strictly on the provided applicant data in JSON format.
Do not invent or assume information. If the answer cannot be determined from the data, say so.

Applicant Data:
${JSON.stringify(applicantsContext, null, 2)}
`;

    const response = await openai.chat.completions.create({
      model: modelName,
      temperature: temperature, // Lower (0.2) because we want deterministic, factual answers based on JSON context
      max_tokens: max_tokens_mid,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: question },
      ],
    });

    res
      .status(200)
      .json({ success: true, data: response.choices[0].message.content });
  } catch (error) {
    console.error("AI Error:", error.message);
    res.status(500).json({
      success: false,
      message: "AI service is currently unavailable. Please try again later.",
    });
  }
};

exports.generateJobDescription = async (req, res) => {
  try {
    const { title, skills, experience } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Job title is required to generate a description.",
      });
    }

    const systemPrompt = `You are an expert HR and Technical Recruiter.
Your task is to generate a professional, engaging, and detailed job description based on the provided parameters.
The output should only contain the job description text (no markdown formatting other than basic paragraphs or bullet points).

Parameters:
Job Title: ${title}
Required Skills: ${skills || "Standard industry skills for this role"}
Experience Required: ${experience || "Standard experience for this role"}
`;

    const userPrompt = "Please generate a professional job description.";

    const response = await openai.chat.completions.create({
      model: modelName,
      temperature: 0.8, // High creativity for writing job descriptions
      max_tokens: max_tokens_large,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    });

    res
      .status(200)
      .json({ success: true, data: response.choices[0].message.content });
  } catch (error) {
    console.error("AI Error:", error.message);
    res.status(500).json({
      success: false,
      message: "AI service is currently unavailable. Please try again later.",
    });
  }
};

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

    const systemPrompt = `You are an expert AI Interview Preparation Assistant.
Generate preparation material for a candidate applying for the following job:
Title: ${job.title}
Company: ${job.recruiter.companyName}
Experience Required: ${job.experience}
Description: ${job.description}
Skills: ${job.skills.join(", ")}

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

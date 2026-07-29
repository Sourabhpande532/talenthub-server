# TalentHub – AI-Powered Hiring Platform

---

A MERN Stack AI-powered hiring platform connecting recruiters and applicants. Recruiters can post jobs, manage applications, and use an AI Hiring Assistant. Applicants can browse jobs, bookmark them, apply, and generate AI-driven interview preparation materials. <br>
Built with a React frontend, Express/Node backend, MongoDB database, and OpenRouter AI integration.

---

## Demo Link

[Live Demo](#)

---

## Quick Start

```bash
git clone https://github.com/YourUsername/TalentHub.git
cd TalentHub/server
npm install
npm run start  # or `npm run dev` with nodemon
```

---

## Technologies

- Node Js
- Express Js
- MongoDB & Mongoose
- JSON Web Tokens (JWT)
- OpenRouter AI (OpenAI SDK)
- Cloudinary
- RESTful APIs

---

## Demo Video

Watch a walkthrough (5-7 minutes) of all major features of this app: <br>
[Drive Video Link](#)

---

## Features

**Dashboard (Recruiter)**

- Overview of active jobs, archived jobs, total applications, and total shortlisted candidates.
- View recent application activity.

**Job Management**

- `Create`, `update`, and `archive` jobs with details like `salary`, `experience`, `location`, and `skills`.
- Applicants can browse, search, sort, and filter jobs dynamically.

**Application & Profile Management**

- Track applicants through defined stages: `New`, `Shortlisted`, `Rejected`.
- Applicants can easily apply to jobs, withdraw applications, and manage bookmarks.
- Role-based profile management for both Applicants and Recruiters.

**✨ AI Features (Powered by OpenRouter)**

- **AI Interview Prep (Applicant):** Generates 5 tailored interview questions and preparation tips based on job data.
- **AI Hiring Assistant (Recruiter):** Analyzes applicant data and answers recruiter questions intelligently.
- **AI Job Description (Recruiter Bonus):** Automatically generates professional job descriptions based on a basic title and required skills.

**Security & Authorization**

- Robust JWT authentication and role-based middleware (`isRecruiter`, `isApplicant`) protecting all endpoints.

---

## API Reference

### POST /auth/register

Create a new Applicant or Recruiter account.
Sample Response:

```json
{ "success": true, "message": "User register successful" }
```

### POST /auth/login

Authenticate a user and return a JWT token.
Sample Response:

```json
{ "success": true, "token": "eyJhb...", "user": { "_id", "name", "email", "role" } }
```

### GET /api/jobs?location=Remote&sort=salary-desc

Retrieve jobs dynamically based on search, filters, and sorting.
Sample Response:

```json
{
  "success": true,
  "count": 10,
  "data": [ { "_id", "title", "salary", "location", "recruiter" } ]
}
```

### POST /api/applications/apply

Apply to a specific job (Applicant only).
Sample Response:

```json
{ "success": true, "message": "Applied successfully", "data": { "_id", "job", "applicant" } }
```

### GET /api/applications/job/:jobId

Fetch all applicants for a specific job (Recruiter only).
Sample Response:

```json
{
  "success": true,
  "count": 5,
  "data": [ { "_id", "applicant", "resume", "status" } ]
}
```

### POST /api/ai/interview-prep

Generate AI interview preparation material for a specific job.
Sample Response:

```json
{
  "success": true,
  "data": "Interview Questions\n\n1. Explain Virtual DOM...\n\nTopics to Revise..."
}
```

### POST /api/ai/hiring-assistant

Ask the AI a question about the candidate pool for a specific job.
Sample Response:

```json
{
  "success": true,
  "data": "Based on the data, John Doe has the strongest frontend profile..."
}
```

---

## Environment Setup

**Backend (server/.env)**

```env
# Server
PORT=5001
NODE_ENV=development

# Database
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/talenthub

# JWT Authentication
JWT_SECRET=your_jwt_secret_key

# Frontend URLs for CORS & OAuth
FRONTEND_URL=http://localhost:3000
CALLBACK_URL=http://localhost:5001/auth/google/callback

# OpenRouter AI
OPENAI_API_KEY=sk-or-v1-your-openrouter-key

# Cloudinary (File Uploads)
CLOUDINARY_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

```

---

## Contact

For bugs or feature requests, please reach out to [sourabhpande43@gmail.com](mailto:sourabhpande43@gmail.com)

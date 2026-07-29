require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
const jwt = require("jsonwebtoken");
const { databaseInitialization } = require("./db/db.connect");
const dns = require("dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);
const bodyParder = require("body-parser");

const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:3000",
  "https://talenthub-client-rho.vercel.app",
];

const corsOption = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  optionSuccessStatus: 200,
};

const app = express();

app.use(cors(corsOption));
app.use(morgan("dev"));
app.use(express.json());
app.use(bodyParder.json());


app.use(async (req, res, next) => {
  try {
    await databaseInitialization();
    next();
  } catch (error) {
    console.error("Database connection error in middleware:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: "Database connection failed",
    });
  }
});

// ROUTES
app.use("/auth", require("./routes/auth.routes"));
app.use("/api/jobs", require("./routes/job.routes"));
app.use("/api/applications", require("./routes/application.routes"));
app.use("/api/users", require("./routes/user.routes"));
app.use("/api/ai", require("./routes/ai.routes"));
app.use("/", require("./routes/upload.routes"))

app.get("/", (req, res) => {
  res.send("Welcome to TalentHub express server");
});

const port = process.env.PORT || 5001;

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}

module.exports = app;

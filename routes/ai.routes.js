const express = require("express");
const app = express();
const auth = require("../middleware/auth");
const { isApplicant } = require( "../middleware/role" );
const { generateInterviewPrep } = require( "../controllers/aiController" );

app.post("/interview-prep", auth, isApplicant, generateInterviewPrep)


module.exports = app;

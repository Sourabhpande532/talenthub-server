require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
const jwt = require("jsonwebtoken");
const { databaseInitialization } = require("./db/db.connect");
const dns = require("dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);
databaseInitialization();

const corsOption = {
  origin: process.env.FRONTEND_URL,
  credential: true,
  optionSuccessStatus: 200,
};

const app = express();

app.use(cors(corsOption));
app.use(morgan("dev"));
app.use(express.json());

app.use("/auth", require("./routes/auth.routes"));

app.get("/",(req,res)=>{
  res.send('Welcome to TalentHub express server')
})

const port = process.env.PORT || 5001;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

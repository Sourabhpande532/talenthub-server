const express = require("express");
const app = express();
const {
  registerUser,
  loginUser,
  getAllUser,
  userById,
} = require("../controllers/authController");
const auth = require("../middleware/auth");

app.post("/register", registerUser);
app.post("/login", loginUser);
app.get("/users", getAllUser);
app.get("/user", auth, userById);

module.exports = app;

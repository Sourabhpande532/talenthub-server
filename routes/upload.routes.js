const express = require("express");
const app = express();
const multer = require("multer");
const { uploadImage, getImages } = require("../controllers/uploadController");
const auth = require("../middleware/auth");

// MULTER SET_UP
const storage = multer.diskStorage({});
const upload = multer({ storage });

app.post("/upload", auth, upload.single("single"), uploadImage);
app.get("/images", auth, getImages);

module.exports = app;

require("dotenv").config();
const cloudinary = require("cloudinary");
const ImageModel = require("../models/Image");

// CLOUDINARY SET_UP
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

exports.uploadImage = async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).send("No file uploaded.");

    // upload img to cloudinary
    const result = await cloudinary.uploader.upload(file.path, {
      folder: "uploads",
    });
    // AFTER uploaded we received link here so we can open with browser any img this link we need to save our mongo db..
    // Save to mongodb
    const newImage = new ImageModel({ imageUrl: result.secure_url });
    await newImage.save();
    res.status(200).json({
      success: true,
      message: "Image uploaded successfully",
      imageUrl: result.secure_url,
    });
  } catch (error) {
    res.status(500).json({ message: "Image upload fail", error: error });
  }
};

exports.getImages = async (req, res) => {
  try {
    const images = await ImageModel.find();
    res.status(200).json(images);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch images", error: error });
  }
};

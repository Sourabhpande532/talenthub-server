const mongoose = require("mongoose");

const databaseInitialization = async () => {
  try {
    const mongoURL = process.env.MONGO_URL;
    if (!mongoURL) {
      throw new Error("url missing, please kindly check");
    }
    await mongoose.connect(mongoURL, {
      dbName: "mcr_fsp_main",
    });
    console.log("DB Connected");
  } catch (error) {
    console.log("DB Failed:", error.message);
  }
};
module.exports = { databaseInitialization };

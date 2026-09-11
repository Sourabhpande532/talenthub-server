const mongoose = require("mongoose");

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const databaseInitialization = async () => {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const mongoURL = process.env.MONGO_URL;
    if (!mongoURL) {
      throw new Error("url missing, please kindly check");
    }
    
    const opts = {
      dbName: "mcr_fsp_main",
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000,
    };
    
    cached.promise = mongoose.connect(mongoURL, opts).then((mongoose) => {
      console.log("DB Connected");
      return mongoose;
    }).catch(err => {
      console.log("DB Failed:", err.message);
      cached.promise = null;
      throw err;
    });
  }
  
  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    throw error;
  }
  
  return cached.conn;
};

module.exports = { databaseInitialization };

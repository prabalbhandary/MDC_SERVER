const mongoose = require("mongoose");
require("colors");

const connectDB = async () => {
  try {
    const url = process.env.MONGO_URL;
    const conn = await mongoose.connect(url);
    const host = await conn.connection.host;
    if(conn){
        console.log(`Connected ${host}`.bgGreen.white)
    }
  } catch (error) {
    console.log(`${error}`.bgRed.white)
  }
};

module.exports = connectDB
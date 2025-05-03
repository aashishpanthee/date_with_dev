const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const databaseConnection = async () => {
  await mongoose.connect(process.env.MONGODB_URL);
};

module.exports = databaseConnection;

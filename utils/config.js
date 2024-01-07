require("dotenv").config();

const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT;
const EMAIL_ADDRESS = process.env.EMAIL_ADDRESS;
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;

module.exports = {
  MONGO_URI,
  PORT,
  EMAIL_ADDRESS,
  EMAIL_PASSWORD,
};

require('dotenv').config();

module.exports = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "personalaccount",
  port: process.env.DB_PORT || "3306",
  connectionLimit: process.env.DB_CONNECTION_LIMIT || "15"
};


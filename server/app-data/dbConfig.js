require('dotenv').config();

module.exports = {
  host: "localhost",
  user: "tapan",
  password: "My.dream@827266",
  database: process.env.DB_NAME || "personalaccount",
  port: process.env.DB_PORT || "3306",
  connectionLimit: process.env.DB_CONNECTION_LIMIT || "15"
};


module.exports = {
  host: process.env.RDS_HOSTNAME,
  user: process.env.RDS_USERNAME,
  password: process.env.RDS_PASSWORD,
  database: process.env.RDS_DATABASE,
  port: process.env.RDS_PORT,
  ssl: true,
  connectionLimit: process.env.RDS_CONNECTION_LIMIT
};

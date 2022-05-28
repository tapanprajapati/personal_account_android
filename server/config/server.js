const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const fileupload = require("express-fileupload");

const { ValidationError } = require("express-validation");
const userRoutes = require("../src/routes/userRoute");
const groupRoutes = require("../src/routes/groupRoute");
const categoryRoutes = require("../src/routes/categoryRoute");
const entryRoutes = require("../src/routes/entryRoute");
const summaryRoutes = require("../src/routes/summaryRoute");

/**
 * Express server initialization
 */
const server = express();

/**
 * Application configuration
 *
 */
server.use(cors());
server.use(bodyParser.json());
server.use(fileupload());

/**
 * Base route
 */
server.get("/", (req, res) => res.sendStatus(200));

const dbConfig = require("./../app-data/dbConfig");
const Database = require("./database");
const database = new Database(dbConfig);

server.get("/testdb", (req, res) => {
  database.connect().then((data) => {
    res.status(200).json(data);
  });
});

server.use("/api/user", userRoutes);
server.use("/api/group", groupRoutes);
server.use("/api/category", categoryRoutes);
server.use("/api/entry", entryRoutes);
server.use("/api/summary", summaryRoutes);
/**
 * Handling unexpected and validation errors
 */
server.use((err, req, res, next) => {
  if (err instanceof ValidationError) {
    return res.status(err.statusCode).json({
      success: false,
      statusCode: 400,
      message: err,
    });
  }
  return res.status(500).json(err);
});

module.exports = server;

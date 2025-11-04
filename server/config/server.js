const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const fileupload = require("express-fileupload");
const cron = require("node-cron");

const { ValidationError } = require("express-validation");
const userRoutes = require("../src/routes/userRoute");
const groupRoutes = require("../src/routes/groupRoute");
const categoryRoutes = require("../src/routes/categoryRoute");
const entryRoutes = require("../src/routes/entryRoute");
const summaryRoutes = require("../src/routes/summaryRoute");
const recurringRoutes = require("../src/routes/recurringRoute");
const RecurringEntryCreator = require("../src/services/RecurringEntryCreator");

const recurringEntryCreator = new RecurringEntryCreator();

cron.schedule('* * * * *', ()=>{
  recurringEntryCreator.run();
})

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

const DatabaseFactory = require("./databaseFactory");
const database = DatabaseFactory.getInstance();

server.get("/testdb", (req, res) => {
  database.connect().then((data) => {
    res.status(200).json(data);
  }).catch(e=>{console.log(e)});
});

server.use("/api/user", userRoutes);
server.use("/api/group", groupRoutes);
server.use("/api/category", categoryRoutes);
server.use("/api/entry", entryRoutes);
server.use("/api/summary", summaryRoutes);
server.use("/api/recurring", recurringRoutes);
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

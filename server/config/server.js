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

cron.schedule('0 0 * * *', ()=>{
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

const allowedOrigins = ['https://personal-account-8464830477.us-central1.run.app', 'http://10.0.0.183:5173'];

const corsOptions = {
  origin: (origin, callback) => {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  // You might also need to specify allowed methods and headers
  // depending on what your web app is sending.
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true // allow session cookie from browser to pass through
};

// Use the configured cors middleware
server.use(cors(corsOptions));

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

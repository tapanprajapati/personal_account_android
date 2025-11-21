const express = require("express");
const router = express.Router();
const { validate } = require("express-validation");

const recurringSchema = require("../helper/validate/recurringSchema");
const RecurringService = require("../services/RecurringService");
const RecurringController = require("../controllers/RecurringController");
const recurringController = new RecurringController(new RecurringService());

router
  .route("/")
  .get(recurringController.getRecurrings);

router
  .route("/create")
  .post(validate(recurringSchema.createRecurring), recurringController.createRecurring);

router
  .route("/update")
  .put(validate(recurringSchema.updateRecurring), recurringController.updateRecurring);

router
  .route("/:id")
  .delete(validate(recurringSchema.deleteRecurring), recurringController.deleteRecurring);

module.exports = router;

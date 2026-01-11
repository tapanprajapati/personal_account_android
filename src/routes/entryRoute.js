const express = require("express");
const router = express.Router();
const { validate } = require("express-validation");
const authentication = require("../helper/authentication");

const entrySchema = require("../helper/validate/entrySchema");
const EntryService = require("../services/EntryService");
const EntryController = require("../controllers/EntryController");
const entryController = new EntryController(new EntryService());

router
  .route("/")
  .get(validate(entrySchema.getEntries), authentication.verifyToken, entryController.getEntries);

router
  .route("/recent")
  .get(validate(entrySchema.recentEntries), authentication.verifyToken, entryController.getRecentEntries);

router
  .route("/create")
  .post(validate(entrySchema.createEntry), authentication.verifyToken, entryController.createEntry);

router
  .route("/update")
  .put(validate(entrySchema.updateEntry), authentication.verifyToken, entryController.updateEntry);

router
  .route("/:id")
  .delete(validate(entrySchema.deleteEntry), authentication.verifyToken, entryController.deleteEntry);

module.exports = router;

const express = require("express");
const router = express.Router();
const { validate } = require("express-validation");

const entrySchema = require("../helper/validate/entrySchema");
const EntryService = require("../services/EntryService");
const EntryController = require("../controllers/EntryController");
const entryController = new EntryController(new EntryService());

router
  .route("/")
  .get(validate(entrySchema.getEntries), entryController.getEntries);

router
  .route("/recent")
  .get(validate(entrySchema.recentEntries), entryController.getRecentEntries);

router
  .route("/create")
  .post(validate(entrySchema.createEntry), entryController.createEntry);

router
  .route("/update")
  .put(validate(entrySchema.updateEntry), entryController.updateEntry);

router
  .route("/:id")
  .delete(validate(entrySchema.deleteEntry), entryController.deleteEntry);

// router.route("/image/save").post(entryController.saveImage);
// router.route("/image/get").get(entryController.retrieveImage);
// router.route("/image/exists").get(entryController.checkImageExists);
// router.route("/image/delete").delete(entryController.deleteImage);

module.exports = router;

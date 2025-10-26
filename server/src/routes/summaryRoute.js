const express = require("express");
const router = express.Router();
const { validate } = require("express-validation");

const summarySchema = require("../helper/validate/summarySchema");
const SummaryService = require("../services/SummaryService");
const SummaryController = require("../controllers/SummaryController");
const summaryController = new SummaryController(new SummaryService());

router
  .route("/year/total")
  .get(validate(summarySchema.totalValidate), summaryController.getYearTotal);

router
  .route("/year/total/allcategories")
  .get(
    validate(summarySchema.totalValidateAllCategories),
    summaryController.getYearTotalAllCategories
  );

router
  .route("/year")
  .get(validate(summarySchema.getYears), summaryController.getYears);

router.route("/year/all").get(summaryController.getAllYears);

router
  .route("/month/total")
  .get(validate(summarySchema.totalValidate), summaryController.getMonthTotal);

router
  .route("/month/total/allcategories")
  .get(
    validate(summarySchema.totalValidateAllCategories),
    summaryController.getMonthTotalAllCategories
  );

router
  .route("/month")
  .get(validate(summarySchema.getMonths), summaryController.getMonths);

router
  .route("/month/all")
  .get(validate(summarySchema.getAllMonths), summaryController.getAllMonths);

router
  .route("/date/total")
  .get(validate(summarySchema.totalValidate), summaryController.getDateTotal);
router
  .route("/date")
  .get(validate(summarySchema.getDates), summaryController.getDates);

router
  .route("/total/:type")
  .get(validate(summarySchema.getTotal), summaryController.getTypeTotal);

router
  .route("/differenceData")
  .get(validate(summarySchema.getDifferenceData), summaryController.getDifferenceData);

router
  .route("/category/all/total/month/:type")
  .get(
    validate(summarySchema.getAllCategoriesTotal),
    summaryController.getAllCategoriesTotalMonth
  );

router
  .route("/category/all/total/:type")
  .get(
    validate(summarySchema.getAllCategoriesTotal_),
    summaryController.getAllCategoriesTotal
  );

router
  .route("/category/all/total/year/:type")
  .get(
    validate(summarySchema.getAllCategoriesTotal),
    summaryController.getAllCategoriesTotalYear
  );
module.exports = router;

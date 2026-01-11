const express = require("express");
const router = express.Router();
const { validate } = require("express-validation");
const authentication = require("../helper/authentication");

const summarySchema = require("../helper/validate/summarySchema");
const SummaryService = require("../services/SummaryService");
const SummaryController = require("../controllers/SummaryController");
const summaryController = new SummaryController(new SummaryService());

router
  .route("/year/total")
  .get(validate(summarySchema.totalValidate), authentication.verifyToken, summaryController.getYearTotal);

router
  .route("/year/total/allcategories")
  .get(
    validate(summarySchema.totalValidateAllCategories),
    authentication.verifyToken,
    summaryController.getYearTotalAllCategories
  );

router
  .route("/year")
  .get(validate(summarySchema.getYears), authentication.verifyToken, summaryController.getYears);

router.route("/year/all").get(summaryController.getAllYears);

router
  .route("/month/total")
  .get(validate(summarySchema.totalValidate), authentication.verifyToken, summaryController.getMonthTotal);

router
  .route("/month/total/allcategories")
  .get(
    validate(summarySchema.totalValidateAllCategories),
    authentication.verifyToken,
    summaryController.getMonthTotalAllCategories
  );

router
  .route("/month")
  .get(validate(summarySchema.getMonths), authentication.verifyToken, summaryController.getMonths);

router
  .route("/month/all")
  .get(validate(summarySchema.getAllMonths), authentication.verifyToken, summaryController.getAllMonths);

router
  .route("/date/total")
  .get(validate(summarySchema.totalValidate), authentication.verifyToken, summaryController.getDateTotal);
router
  .route("/date")
  .get(validate(summarySchema.getDates), authentication.verifyToken, summaryController.getDates);

router
  .route("/total/:type")
  .get(validate(summarySchema.getTotal), authentication.verifyToken, summaryController.getTypeTotal);

router
  .route("/differenceData")
  .get(validate(summarySchema.getDifferenceData), authentication.verifyToken, summaryController.getDifferenceData);

router
  .route("/category/all/total/month/:type")
  .get(
    validate(summarySchema.getAllCategoriesTotal),
    authentication.verifyToken,
    summaryController.getAllCategoriesTotalMonth
  );

router
  .route("/category/all/total/:type")
  .get(
    validate(summarySchema.getAllCategoriesTotal_),
    authentication.verifyToken,
    summaryController.getAllCategoriesTotal
  );

router
  .route("/category/all/total/year/:type")
  .get(
    validate(summarySchema.getAllCategoriesTotal),
    authentication.verifyToken,
    summaryController.getAllCategoriesTotalYear
  );

router
  .route("/category/all/:type")
  .get(
    validate(summarySchema.getAllCategoriesSummary),
    authentication.verifyToken,
    summaryController.getAllCategoriesSummary
  );
module.exports = router;

const express = require("express");
const router = express.Router();

const SmartQueryService = require("../services/SmartQueryService");
const SmartQueryController = require("../controllers/SmartQueryController");
const smartQueryController = new SmartQueryController(new SmartQueryService());
const { validate } = require("express-validation");
const smartQuerySchema = require("../helper/validate/smartQuerySchema");

router.route("/").post(validate(smartQuerySchema.validate), smartQueryController.getData);

module.exports = router;

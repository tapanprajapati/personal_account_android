const express = require("express");
const router = express.Router();
const { validate } = require("express-validation");
const authentication = require("../helper/authentication");

const categorySchema = require("../helper/validate/categorySchema");
const CategoryService = require("../services/CategoryService");
const CategoryController = require("../controllers/CategoryController");
const categoryController = new CategoryController(new CategoryService());

router
  .route("/:groupid")
  .get(
    validate(categorySchema.getCategories),
    authentication.verifyToken,
    categoryController.getCategories
  );

router
  .route("/create")
  .post(
    validate(categorySchema.createCategory),
    authentication.verifyToken,
    categoryController.createCategory
  );

router
  .route("/exists")
  .get(validate(categorySchema.exists), authentication.verifyToken, categoryController.exists);

router
  .route("/update/:id")
  .put(
    validate(categorySchema.updateCategory),
    authentication.verifyToken,
    categoryController.updateCategory
  );

router
  .route("/:id")
  .delete(
    validate(categorySchema.deleteCategory),
    authentication.verifyToken,
    categoryController.deleteCategory
  );

router
  .route("/transfer/:id")
  .put(
    validate(categorySchema.transferCategory),
    authentication.verifyToken,
    categoryController.transferCategory
  );

module.exports = router;

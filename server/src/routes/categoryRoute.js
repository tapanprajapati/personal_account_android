const express = require("express");
const router = express.Router();
const { validate } = require("express-validation");

const categorySchema = require("../helper/validate/categorySchema");
const CategoryService = require("../services/CategoryService");
const CategoryController = require("../controllers/CategoryController");
const categoryController = new CategoryController(new CategoryService());

router
  .route("/:groupid")
  .get(
    validate(categorySchema.getCategories),
    categoryController.getCategories
  );

router
  .route("/create")
  .post(
    validate(categorySchema.createCategory),
    categoryController.createCategory
  );

router
  .route("/exists")
  .get(validate(categorySchema.exists), categoryController.exists);

router
  .route("/update/:id")
  .put(
    validate(categorySchema.updateCategory),
    categoryController.updateCategory
  );

router
  .route("/:id")
  .delete(
    validate(categorySchema.deleteCategory),
    categoryController.deleteCategory
  );

router
  .route("/transfer/:id")
  .put(
    validate(categorySchema.transferCategory),
    categoryController.transferCategory
  );

module.exports = router;

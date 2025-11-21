const express = require("express");
const router = express.Router();
const { validate } = require("express-validation");

const userSchema = require("../helper/validate/userSchema");
const UserService = require("../services/UserService");
const UserController = require("../controllers/UserController");
const userController = new UserController(new UserService());

router.route("/").get(validate(userSchema.getAll), userController.getAllUsers);

router
  .route("/:username")
  .get(validate(userSchema.validate), userController.getUser)
  .post(validate(userSchema.validate), userController.createUser);

module.exports = router;

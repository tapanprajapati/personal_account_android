const express = require("express");
const router = express.Router();
const { validate } = require("express-validation");
const authentication = require("../helper/authentication");

const groupSchema = require("../helper/validate/groupSchema");
const GroupService = require("../services/GroupService");
const GroupController = require("../controllers/GroupController");
const groupController = new GroupController(new GroupService());

router
  .route("/:username")
  .get(validate(groupSchema.getGroups), authentication.verifyToken, groupController.getGroups);

router
  .route("/create")
  .post(validate(groupSchema.createGroup), authentication.verifyToken, groupController.createGroup);

router
  .route("/join")
  .post(validate(groupSchema.joinGroup), authentication.verifyToken, groupController.joinGroup);

router
  .route("/leave")
  .post(validate(groupSchema.leaveGroup), authentication.verifyToken, groupController.leaveGroup);

module.exports = router;

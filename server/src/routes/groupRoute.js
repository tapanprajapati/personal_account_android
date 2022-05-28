const express = require("express");
const router = express.Router();
const { validate } = require("express-validation");

const groupSchema = require("../helper/validate/groupSchema");
const GroupService = require("../services/GroupService");
const GroupController = require("../controllers/GroupController");
const groupController = new GroupController(new GroupService());

router
  .route("/:username")
  .get(validate(groupSchema.getGroups), groupController.getGroups);

router
  .route("/create")
  .post(validate(groupSchema.createGroup), groupController.createGroup);

router
  .route("/join")
  .post(validate(groupSchema.joinGroup), groupController.joinGroup);

router
  .route("/leave")
  .post(validate(groupSchema.leaveGroup), groupController.leaveGroup);

module.exports = router;

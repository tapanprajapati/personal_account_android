const { Joi } = require("express-validation");

module.exports = {
  getGroups: {
    params: Joi.object({
      username: Joi.string().required(),
    }),
  },
  createGroup: {
    body: Joi.object({
      username: Joi.string().required(),
      groupname: Joi.string().required(),
    }),
  },
  joinGroup: {
    body: Joi.object({
      username: Joi.string().required(),
      groupname: Joi.string().required(),
    }),
  },
  renameGroup: {
    body: Joi.object({
      id: Joi.string().required(),
      title: Joi.string().required(),
    }),
  },
  leaveGroup: {
    body: Joi.object({
      username: Joi.string().required(),
      groupname: Joi.string().required(),
    }),
  },
};

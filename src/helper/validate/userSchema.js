const { Joi } = require("express-validation");

module.exports = {
  login: {
    body: Joi.object({
      username: Joi.string().required(),
      password: Joi.string().required(),
    }),
  },
  getAll: {
    query: Joi.object({
      groupid: Joi.string().required(),
    }),
  },
};

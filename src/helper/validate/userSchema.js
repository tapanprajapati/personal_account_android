const { Joi } = require("express-validation");

module.exports = {
  validate: {
    params: Joi.object({
      username: Joi.string().required(),
    }),
  },
  getAll: {
    query: Joi.object({
      groupid: Joi.string().required(),
    }),
  },
};

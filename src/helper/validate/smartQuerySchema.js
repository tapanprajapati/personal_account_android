const { Joi } = require("express-validation");

module.exports = {
  validate: {
    body: Joi.object({
      query: Joi.string().required(),
    }),
  },
};

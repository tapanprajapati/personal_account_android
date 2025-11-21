const { Joi } = require("express-validation");

module.exports = {
  createRecurring: {
    body: Joi.object({
      title: Joi.string().required(),
      description: Joi.string().required().allow(""),
      amount: Joi.number().required(),
      start_date: Joi.date().required(),
      freq: Joi.string().equal("month", "week", "bi-week", "year"),
      categoryid: Joi.string().required(),
      username: Joi.string().required(),
    }),
  },
  updateRecurring: {
    body: Joi.object({
      title: Joi.string().required(),
      description: Joi.string().required().allow(""),
      amount: Joi.number().required(),
      freq: Joi.string().equal("month", "week", "bi-week", "year"),
      start_date: Joi.date().required(),
      categoryid: Joi.string().required(),
      username: Joi.string().required(),
      id: Joi.string().required()
    }),
  },
  deleteRecurring: {
    params: Joi.object({
      id: Joi.string().required(),
    }),
  },
};

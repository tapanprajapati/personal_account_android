const { Joi } = require("express-validation");

module.exports = {
  getEntries: {
    query: Joi.object({
      search: Joi.string().required().allow(""),
      categories: Joi.string().required(),
      date: Joi.string().required(),
      user: Joi.optional(),
    }),
  },
  recentEntries: {
    query: Joi.object({
      limit: Joi.number().required(),
    }),
  },
  createEntry: {
    body: Joi.object({
      title: Joi.string().required(),
      description: Joi.string().required().allow(""),
      amount: Joi.number().required(),
      date: Joi.date().required(),
      categoryid: Joi.string().required(),
      username: Joi.string().required(),
    }),
  },
  updateEntry: {
    body: Joi.object({
      id: Joi.string().required(),
      title: Joi.string().required(),
      description: Joi.string().required().allow(""),
      amount: Joi.number().required(),
      date: Joi.date().required(),
      categoryid: Joi.string().required(),
      username: Joi.string().required(),
    }),
  },
  deleteEntry: {
    params: Joi.object({
      id: Joi.string().required(),
    }),
  },
};

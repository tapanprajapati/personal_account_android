const { Joi } = require("express-validation");

module.exports = {
  getCategories: {
    query: Joi.object({
      type: Joi.string().required().equal("income", "expense"),
    }),
  },
  createCategory: {
    body: Joi.object({
      title: Joi.string().required(),
      groupid: Joi.string().required(),
      type: Joi.string().equal("income", "expense"),
      allowance: Joi.number().required(),
    }),
  },

  exists: {
    query: Joi.object({
      title: Joi.string().required(),
      groupid: Joi.string().required(),
      type: Joi.string().equal("income", "expense"),
    }),
  },
  updateCategory: {
    params: Joi.object({
      id: Joi.string().required(),
    }),
    query: Joi.object({
      title: Joi.string().required(),
      groupid: Joi.string().required(),
      allowance: Joi.string().required(),
      type: Joi.string().equal("income", "expense"),
    }),
  },
  transferCategory: {
    params: Joi.object({
      id: Joi.string().required(),
    }),
    query: Joi.object({
      to: Joi.string().required(),
    }),
  },
  deleteCategory: {
    params: Joi.object({
      id: Joi.string().required(),
    }),
  },
};

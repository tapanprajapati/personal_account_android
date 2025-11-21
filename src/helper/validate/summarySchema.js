const { Joi } = require("express-validation");

module.exports = {
  totalValidate: {
    query: Joi.object({
      search: Joi.string().required().allow(""),
      categories: Joi.string().required(),
      date: Joi.string().required(),
      user: Joi.optional(),
    }),
  },
  totalValidateAllCategories: {
    query: Joi.object({
      type: Joi.string().required(),
      date: Joi.string().required(),
      groupid: Joi.string().required(),
    }),
  },
  getYears: {
    query: Joi.object({
      search: Joi.string().required().allow(""),
      categories: Joi.string().required(),
    }),
  },
  getMonths: {
    query: Joi.object({
      search: Joi.string().required().allow(""),
      categories: Joi.string().required(),
      date: Joi.string().required(),
    }),
  },
  getAllMonths: {
    query: Joi.object({
      date: Joi.string().required(),
    }),
  },
  getDates: {
    query: Joi.object({
      search: Joi.string().required().allow(""),
      categories: Joi.string().required(),
      date: Joi.string().required(),
    }),
  },
  getTotal: {
    params: Joi.object({
      type: Joi.string().required().equal("income", "expense"),
    }),
    query: Joi.object({
      date: Joi.string().required(),
      groupid: Joi.string().required(),
    }),
  },
  getDifferenceData: {
    query: Joi.object({
      incomeCategories: Joi.string().required(),
      expenseCategories: Joi.string().required(),
    }),
  },
  getAllCategoriesTotal: {
    params: Joi.object({
      type: Joi.string().required().equal("income", "expense"),
    }),
    query: Joi.object({
      date: Joi.string().required(),
      groupid: Joi.string().required(),
    }),
  },

  getAllCategoriesTotal_: {
    params: Joi.object({
      type: Joi.string().required().equal("income", "expense"),
    }),
    query: Joi.object({
      groupid: Joi.string().required(),
    }),
  },
  getAllCategoriesSummary: {
    params: Joi.object({
      type: Joi.string().required().equal("income", "expense"),
    }),
    query: Joi.object({
      year: Joi.string().required(),
    }),
  },
};

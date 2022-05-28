const mysql = require("mysql");
const Database = require("../../config/database");
const dbConfig = require("../../app-data/dbConfig");
const queries = require("../../app-data/queries");

const database = new Database(dbConfig);

function CategoryService() {}

CategoryService.prototype.getCategories = async function getCategories(
  params,
  query
) {
  const get = mysql.format(queries.category.getCategories, [
    params.groupid,
    query.type,
  ]);

  console.log(`Query to get all categories: ${get}`);

  try {
    let result = await database.query(get);

    return {
      success: true,
      statusCode: 200,
      message: result,
    };
  } catch (error) {
    return {
      success: false,
      statusCode: 500,
      message: "Unexpected error. Please try again after sometime.",
      error,
    };
  }
};

CategoryService.prototype.createCategory = async function createCategory(body) {
  const timeStamp = new Date().getTime().toString();

  const checkCategoryExists = mysql.format(queries.category.exists, [
    body.title,
    body.type,
    body.groupid,
  ]);

  console.log(`Query to check if category exists: ${checkCategoryExists}`);

  try {
    let result = await database.query(checkCategoryExists);

    if (result.length !== 0) {
      return {
        success: false,
        statusCode: 400,
        message: "category exists",
      };
    }

    const createCategory = mysql.format(queries.category.createCategory, [
      timeStamp,
      body.title,
      body.type,
      body.groupid,
      body.allowance,
    ]);

    console.log(`Query to create category: ${createCategory}`);

    let result1 = await database.query(createCategory);

    return {
      success: true,
      statusCode: 200,
      message: "new category created successfully",
    };
  } catch (error) {
    return {
      success: false,
      statusCode: 500,
      message: "Unexpected error. Please try again after sometime.",
      error,
    };
  }
};

CategoryService.prototype.updateCategory = async function updateCategory(
  params,
  query
) {
  const checkCategoryExists = mysql.format(queries.category.exists, [
    query.title,
    query.type,
    query.groupid,
  ]);

  console.log(`Query to check if category exists: ${checkCategoryExists}`);

  try {
    let result1 = await database.query(checkCategoryExists);

    if (result1.length !== 0 && result1[0].id != params.id) {
      return {
        success: false,
        statusCode: 400,
        message: "category exists",
      };
    }

    const rename = mysql.format(queries.category.updateCategory, [
      query.title,
      query.allowance,
      params.id,
    ]);

    console.log(`Query to rename category: ${rename}`);
    let result = await database.query(rename);

    if (result.affectedRows === 0) {
      return {
        success: false,
        statusCode: 400,
        message: "Category does not exist",
      };
    }

    return {
      success: true,
      statusCode: 200,
      message: "category renamed successfully",
    };
  } catch (error) {
    return {
      success: false,
      statusCode: 500,
      message: "Unexpected error. Please try again after sometime.",
      error,
    };
  }
};

CategoryService.prototype.transferCategory = async function transferCategory(
  params,
  query
) {
  const transfer = mysql.format(queries.category.transferCategory, [
    query.to,
    params.id,
  ]);

  console.log(`Query to rename category: ${transfer}`);

  try {
    let result = await database.query(transfer);

    return {
      success: true,
      statusCode: 200,
      message: `${result.affectedRows} entries transferred successfully`,
    };
  } catch (error) {
    return {
      success: false,
      statusCode: 500,
      message: "Unexpected error. Please try again after sometime.",
      error,
    };
  }
};

CategoryService.prototype.deleteCategory = async function deleteCategory(
  params
) {
  const deleteEntries = mysql.format(queries.category.deleteEntries, [
    params.id,
  ]);

  console.log(`Query to delete all entries in this category: ${deleteEntries}`);

  try {
    let result = await database.query(deleteEntries);

    const deleteCategory = mysql.format(queries.category.deleteCategory, [
      params.id,
    ]);

    console.log(`Query to delete category: ${deleteCategory}`);

    let result1 = await database.query(deleteCategory);

    return {
      success: true,
      statusCode: 200,
      message: "category delete successfully",
    };
  } catch (error) {
    return {
      success: false,
      statusCode: 500,
      message: "Unexpected error. Please try again after sometime.",
      error,
    };
  }
};

module.exports = CategoryService;

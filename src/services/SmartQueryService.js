const mysql = require("mysql");
const DatabaseFactory = require("../../config/databaseFactory")

const database = DatabaseFactory.getInstance();

function SmartQueryService() {}

SmartQueryService.prototype.getData = async function getData(query) {
  const get = "TODO"

  console.log(`Query to create new user: ${get}`);

  try {
    let result = await database.query(get);

    return {
      success: true,
      statusCode: 200,
      message: result,
    };
  } catch (error) {
    if (error.errno === 1062) {
      return {
        success: false,
        statusCode: 400,
        message: "User already exist",
      };
    } else {
      return {
        success: false,
        statusCode: 500,
        message: "Unexpected error. Please try again after sometime.",
        error,
      };
    }
  }
};

module.exports = SmartQueryService;

const mysql = require("mysql");
const bcrypt = require("bcryptjs");
const DatabaseFactory = require("../../config/databaseFactory")
const queries = require("./../../app-data/queries");
const Authentication = require("./../helper/authentication");

const database = DatabaseFactory.getInstance();

function UserService() {}

UserService.prototype.createUser = async function createUser(params) {
  const create = mysql.format(queries.user.createUser, [params.username]);

  console.log(`Query to create new user: ${create}`);

  try {
    let result = await database.query(create);

    return {
      success: true,
      statusCode: 200,
      message: "User created successfully",
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

UserService.prototype.getAllUsers = async function createUser(query) {
  const get = mysql.format(queries.user.getAllUsers, [query.groupid]);

  console.log(`Query to get all user: ${get}`);

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

UserService.prototype.loginUser = async function loginUser(body) {
    const get = mysql.format(queries.user.getUser, [body.username]);

    console.log(`Query to get user: ${get}`);

    try {
        let result = await database.query(get);

        if (result.length === 0) {
            return {
                success: false,
                statusCode: 404,
                message: "User does not exist",
            };
        }

        if (result.length === 1) {
            const user = result[0];
            const isMatch = await bcrypt.compare(body.password, user.password);
            if (!isMatch) {
                return {
                    success: false,
                    statusCode: 400,
                    message: "Invalid password",
                };
            }
            const token = Authentication.generateToken(user);
            return {
                success: true,
                statusCode: 200,
                message: "welcome user",
                token,
            };
        }
    } catch (error) {
        return {
            success: false,
            statusCode: 500,
            message: "Unexpected error. Please try again after sometime.",
            error,
        };
    }
};

module.exports = UserService;

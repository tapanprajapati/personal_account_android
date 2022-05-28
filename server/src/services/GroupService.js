const mysql = require("mysql");
const Database = require("../../config/database");
const dbConfig = require("../../app-data/dbConfig");
const queries = require("../../app-data/queries");

const database = new Database(dbConfig);

function GroupService() {}

GroupService.prototype.getGroups = async function getGroups(params) {
  const get = mysql.format(queries.group.getGroups, [params.username]);

  console.log(`Query to get all groups: ${get}`);

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

GroupService.prototype.createGroup = async function createGroup(body) {
  const timeStamp = new Date().getTime().toString();

  const checkGroupExists = mysql.format(queries.group.exists, [body.groupname]);

  console.log(`Query to check if group exists: ${checkGroupExists}`);

  try {
    let result = await database.query(checkGroupExists);

    if (result.length !== 0) {
      return {
        success: false,
        statusCode: 400,
        message: "group exists",
      };
    }

    const insertIntoGroup = mysql.format(queries.group.insertIntoGroup, [
      timeStamp,
      body.groupname,
    ]);

    console.log(`Query to insert new group: ${insertIntoGroup}`);

    let result1 = await database.query(insertIntoGroup);

    const insertIntoUserGroupMap = mysql.format(
      queries.group.insertIntoUserGroupMap,
      [body.username, timeStamp]
    );

    console.log(`Query to insert usergroupmap: ${insertIntoUserGroupMap}`);

    let result2 = await database.query(insertIntoUserGroupMap);

    return {
      success: true,
      statusCode: 200,
      message: "new group created successfully",
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

GroupService.prototype.joinGroup = async function joinGroup(body) {
  const join = mysql.format(queries.group.joinGroup, [
    body.username,
    body.groupname,
  ]);

  console.log(`Query to join group: ${join}`);

  try {
    let result = await database.query(join);

    return {
      success: true,
      statusCode: 200,
      message: "user joined new group",
    };
  } catch (error) {
    if (error.errno === 1062) {
      return {
        success: false,
        statusCode: 400,
        message: "User is already part of the group",
      };
    }
    return {
      success: false,
      statusCode: 500,
      message: "Unexpected error. Please try again after sometime.",
      error,
    };
  }
};

GroupService.prototype.leaveGroup = async function leaveGroup(body) {
  const leave = mysql.format(queries.group.leaveGroup, [
    body.username,
    body.groupname,
  ]);

  console.log(`Query to leave group: ${leave}`);

  try {
    let result = await database.query(leave);

    return {
      success: true,
      statusCode: 200,
      message: "user left group",
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

module.exports = GroupService;

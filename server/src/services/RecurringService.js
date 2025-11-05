const mysql = require("mysql");
const DatabaseFactory = require("../../config/databaseFactory")
const queries = require("../../app-data/queries");

const database = DatabaseFactory.getInstance();

function RecurringService() {}

RecurringService.prototype.getRecurrings = async function getRecurrings() {
  const get = mysql.format(queries.recurring.getRecurrings, []);

  console.log(`Query to get all recurrings: ${get}`);

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

RecurringService.prototype.createRecurring = async function createRecurring(body) {
  const timeStamp = new Date().getTime().toString();

  const create = mysql.format(queries.recurring.exists, [
    body.title,
    body.description,
    body.amount,
    body.start_date,
    timeStamp,
    null,
    null,
    body.freq,
    body.categoryid,
    body.username,
  ]);
  try {

    console.log(`Query to create recurring: ${create}`);

    let result1 = await database.query(create);

    return {
      success: true,
      statusCode: 200,
      message: "new recurring created successfully",
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

RecurringService.prototype.updateRecurringSchedule = async function updateRecurringSchedule(recurring) {
  try {
    const update = mysql.format(queries.recurring.updateRecurringSchedule, [
      recurring.last_run_date,
      recurring.next_run_date,
      recurring.id
    ]);

    console.log(`Query to update recurring schedule: ${update}`);
    let result = await database.query(update);

    if (result.affectedRows === 0) {
      return {
        success: false,
        statusCode: 400,
        message: "Recurring does not exist",
      };
    }

    return {
      success: true,
      statusCode: 200,
      message: "recurring schedule update successfully",
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

RecurringService.prototype.updateRecurring = async function updateRecurring(recurring) {
  try {
    const update = mysql.format(queries.recurring.updateRecurringSchedule, [
      recurring.title,
      recurring.description,
      recurring.amount,
      recurring.categoryid,
      recurring.username,
      recurring.freq,
      recurring.start_date,
      recurring.id
    ]);

    console.log(`Query to update recurring: ${update}`);
    let result = await database.query(update);

    if (result.affectedRows === 0) {
      return {
        success: false,
        statusCode: 400,
        message: "Recurring does not exist",
      };
    }

    return {
      success: true,
      statusCode: 200,
      message: "recurring update successfully",
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

RecurringService.prototype.deleteRecurring = async function deleteRecurring(
  params
) {
  try {
    const deleteRecurring = mysql.format(queries.recurring.deleteRecurring, [
      params.id,
    ]);

    console.log(`Query to delete recurring: ${deleteRecurring}`);

    let result1 = await database.query(deleteRecurring);

    return {
      success: true,
      statusCode: 200,
      message: "recurring delete successfully",
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

module.exports = RecurringService;

const mysql = require("mysql");
const DatabaseFactory = require("../../config/databaseFactory")
const queries = require("../../app-data/queries");

const database = DatabaseFactory.getInstance();

function EntryService() {}

EntryService.prototype.getEntries = async function getEntries(query) {
  let get = mysql.format(queries.entry.getEntriesOfDate, [
    `%${query.search}%`,
    query.date,
    query.categories.split(","),
  ]);

  get +=
    query.user == "ALL" || !query.user ? "" : ` and username ='${query.user}'`;

  console.log(`Query to get all entries: ${get}`);

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

EntryService.prototype.getRecentEntries = async function getRecentEntries(
  query
) {
  const limit = parseInt(query.limit);
  const get = mysql.format(queries.entry.recentEntries, [limit]);

  console.log(`Query to get recent entries: ${get}`);

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

EntryService.prototype.createEntry = async function createEntry(body) {
  const timeStamp = new Date().getTime().toString();

  const createEntry = mysql.format(queries.entry.createEntry, [
    timeStamp,
    body.title,
    body.description,
    body.amount,
    body.date,
    body.categoryid,
    body.username,
  ]);

  console.log(`Query to create entry: ${createEntry}`);

  try {
    let result = await database.query(createEntry);

    return {
      success: true,
      statusCode: 200,
      message: "new entry created successfully",
      id: timeStamp,
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

EntryService.prototype.updateEntry = async function updateEntry(body) {
  const update = mysql.format(queries.entry.updateEntry, [
    body.title,
    body.description,
    body.amount,
    body.date,
    body.categoryid,
    body.username,
    body.id,
  ]);

  console.log(`Query to update entry: ${update}`);

  try {
    let result = await database.query(update);

    return {
      success: true,
      statusCode: 200,
      message: "entry updated successfully",
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

EntryService.prototype.deleteEntry = async function deleteEntry(params) {
  const deleteEntry = mysql.format(queries.entry.deleteEntry, [params.id]);

  console.log(`Query to delete entry: ${deleteEntry}`);

  try {
    let result = await database.query(deleteEntry);

    return {
      success: true,
      statusCode: 200,
      message: "entry delete successfully",
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

EntryService.prototype.saveImage = async function saveImage(req) {
  return new Promise((resolve, rejects) => {
    try {
      if (!req.files || Object.keys(req.files).length === 0) {
        resolve({
          success: false,
          statusCode: 400,
          message: "No file uploaded",
        });
      }

      // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
      let sampleFile = req.files.image;

      // Use the mv() method to place the file somewhere on your server
      sampleFile.mv(`./images/${req.body.name}.jpg`, function (err) {
        if (err)
          resolve({
            success: false,
            statusCode: 500,
            message: "Error uploading file",
          });

        resolve({
          success: true,
          statusCode: 200,
          message: "file created successfully",
        });
      });
    } catch (error) {
      resolve({
        success: false,
        statusCode: 500,
        message: "Unexpected error. Please try again after sometime.",
        error,
      });
    }
  });
};

module.exports = EntryService;

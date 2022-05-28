const mysql = require("mysql");
const Database = require("../../config/database");
const dbConfig = require("../../app-data/dbConfig");
const queries = require("../../app-data/queries");

const database = new Database(dbConfig);

function SummaryService() {}

SummaryService.prototype.getYearTotal = async function getYearTotal(query) {
  let get = mysql.format(queries.summary.yearTotal, [
    `%${query.search}%`,
    query.date,
    query.categories.split(","),
  ]);

  get +=
    query.user == "ALL" || !query.user ? "" : ` and username ='${query.user}'`;

  console.log(`Query to get year total: ${get}`);

  try {
    let result = await database.query(get);

    total = result[0].total;
    if (total == null) {
      total = 0;
    }

    return {
      success: true,
      statusCode: 200,
      message: total,
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

SummaryService.prototype.getYearTotalAllCategories =
  async function getYearTotalAllCategories(query) {
    const get = mysql.format(queries.summary.yearTotalAllCategories, [
      query.date,
      query.type,
      query.groupid,
    ]);

    console.log(`Query to get year total for all categories: ${get}`);

    try {
      let result = await database.query(get);

      total = result[0].total;
      if (total == null) {
        total = 0;
      }

      return {
        success: true,
        statusCode: 200,
        message: total,
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

SummaryService.prototype.getMonthTotal = async function getMonthTotal(query) {
  let get = mysql.format(queries.summary.monthTotal, [
    `%${query.search}%`,
    query.date,
    query.categories.split(","),
  ]);

  get +=
    query.user == "ALL" || !query.user ? "" : ` and username ='${query.user}'`;

  console.log(`Query to get month total: ${get}`);

  try {
    let result = await database.query(get);

    total = result[0].total;
    if (total == null) {
      total = 0;
    }

    return {
      success: true,
      statusCode: 200,
      message: total,
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

SummaryService.prototype.getMonthTotalAllCategories =
  async function getMonthTotalAllCategories(query) {
    const get = mysql.format(queries.summary.monthTotalAllCategories, [
      query.date,
      query.type,
      query.groupid,
    ]);

    console.log(`Query to get month total for all categories: ${get}`);

    try {
      let result = await database.query(get);

      total = result[0].total;
      if (total == null) {
        total = 0;
      }

      return {
        success: true,
        statusCode: 200,
        message: total,
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

SummaryService.prototype.getDateTotal = async function getDateTotal(query) {
  const get = mysql.format(queries.summary.dateTotal, [
    `%${query.search}%`,
    query.date,
    query.categories.split(","),
  ]);

  console.log(`Query to get date total: ${get}`);

  try {
    let result = await database.query(get);

    total = result[0].total;
    if (total == null) {
      total = 0;
    }

    return {
      success: true,
      statusCode: 200,
      message: total,
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

SummaryService.prototype.getYears = async function getYears(query) {
  const get = mysql.format(queries.summary.getYears, [
    `%${query.search}%`,
    query.categories.split(","),
  ]);

  console.log(`Query to get years: ${get}`);

  try {
    let result = await database.query(get);

    let years = result.map((year) => year.year);

    return {
      success: true,
      statusCode: 200,
      message: years,
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

SummaryService.prototype.getAllYears = async function getAllYears(query) {
  const get = mysql.format(queries.summary.getAllYears, []);

  console.log(`Query to get all years: ${get}`);

  try {
    let result = await database.query(get);

    let years = result.map((year) => year.year);

    return {
      success: true,
      statusCode: 200,
      message: years,
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

SummaryService.prototype.getMonths = async function getMonths(query) {
  const get = mysql.format(queries.summary.getMonths, [
    `%${query.search}%`,
    query.date,
    query.categories.split(","),
  ]);

  console.log(`Query to get months: ${get}`);

  try {
    let result = await database.query(get);

    let months = result.map((month) => month.month);

    return {
      success: true,
      statusCode: 200,
      message: months,
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

SummaryService.prototype.getAllMonths = async function getAllMonths(query) {
  const get = mysql.format(queries.summary.getAllMonths, [query.date]);

  console.log(`Query to get all months: ${get}`);

  try {
    let result = await database.query(get);

    let months = result.map((month) => month.month);

    return {
      success: true,
      statusCode: 200,
      message: months,
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

SummaryService.prototype.getDates = async function getDates(query) {
  const get = mysql.format(queries.summary.getDates, [
    `%${query.search}%`,
    query.date,
    query.categories.split(","),
  ]);

  console.log(`Query to get dates: ${get}`);

  try {
    let result = await database.query(get);

    let dates = result.map((date) => date.date);

    return {
      success: true,
      statusCode: 200,
      message: dates,
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

SummaryService.prototype.getTypeTotal = async function getTypeTotal(
  params,
  query
) {
  const get = mysql.format(queries.summary.getTypeTotal, [
    params.type,
    query.date,
    query.groupid,
  ]);

  console.log(`Query to get type total: ${get}`);

  try {
    let result = await database.query(get);

    let total = result[0].total;
    if (!total) {
      total = 0;
    }
    return {
      success: true,
      statusCode: 200,
      message: total,
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

SummaryService.prototype.getAllCategoriesTotal =
  async function getAllCategoriesTotal(params, query) {
    const get = mysql.format(queries.summary.getAllCategoriesTotal, [
      params.type,
      query.groupid,
    ]);

    console.log(`Query to get all categories total: ${get}`);

    try {
      let result = await database.query(get);

      result.forEach((item) => {
        if (item.total === null) {
          item.total = 0;
        }
      });

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

SummaryService.prototype.getAllCategoriesTotalMonth =
  async function getAllCategoriesTotalMonth(params, query) {
    const get = mysql.format(queries.summary.getAllCategoriesTotalMonth, [
      query.date,
      params.type,
      query.groupid,
    ]);

    console.log(`Query to get all categories total: ${get}`);

    try {
      let result = await database.query(get);

      result.forEach((item) => {
        if (item.total === null) {
          item.total = 0;
        }
      });

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

SummaryService.prototype.getAllCategoriesTotalYear =
  async function getAllCategoriesTotalYear(params, query) {
    const get = mysql.format(queries.summary.getAllCategoriesTotalYear, [
      query.date,
      params.type,
      query.groupid,
    ]);

    console.log(`Query to get all categories total: ${get}`);

    try {
      let result = await database.query(get);

      result.forEach((item) => {
        if (item.total === null) {
          item.total = 0;
        }
      });

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

module.exports = SummaryService;

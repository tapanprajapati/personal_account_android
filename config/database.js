const mysql = require("mysql");

function Database(config) {
  this.connectionPool = mysql.createPool(config);
}
Database.prototype.query = function query(sql, args) {
  return new Promise((resolve, reject) => {
    this.connectionPool.getConnection((err, connection) => {
      if (err) {
        return reject(err)
      }
      connection.query(sql, args, (err2, result) => {
        if (err2) {
          connection.release();
          return reject(err);
        }
        connection.release();
        return resolve(result);
      });
    })
  });
};
Database.prototype.connect = function connect() {
  return new Promise((resolve, reject) => {
    this.connectionPool.getConnection((err,connection) => {
      if (err) {
        console.log(err);
        return resolve(err);
      }
      connection.release();
      return resolve({
        success: true,
        message: "Database connection established.",
      });
    })
  });
};
Database.prototype.end = function end() {
  return new Promise((resolve, reject) => {
    this.connection.end((err) => {
      if (err) {
        return reject(err);
      }
      return resolve({
        success: true,
        message: "Database connection closed.",
      });
    });
  });
};

module.exports = Database;

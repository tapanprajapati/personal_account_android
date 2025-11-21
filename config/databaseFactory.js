const Database = require("./database");
const config = require("./../app-data/dbConfig");

var DatabaseFactory = (function() {
    var instance;

    return {
        getInstance : function() {
            if (instance == null) {
                instance = new Database(config)
            }
            return instance;
        }
    }
})();

module.exports = DatabaseFactory;
import {openDatabase} from 'react-native-sqlite-storage';
import {DB} from './utils';

export default class EntryDBHandler {
  constructor() {
    this.db = openDatabase({name: DB.dbname});
    this.table = DB.tables.entries.name;
    this.columns = DB.tables.entries.columns;
    this.catTable = DB.tables.categories;
  }

  addEntry(entry) {
    console.log('In handler');
    return new Promise((resolve, reject) => {
      console.log('Starting transaction');
      this.db.transaction((tx) => {
        const addSQL = `INSERT INTO ${this.table} (${this.columns.title.title},${this.columns.description.title},${this.columns.amount.title},${this.columns.date.title},${this.columns.categoryId.title}) VALUES (?,?,?,?,?)`;
        let data = [
          entry.title,
          entry.description,
          entry.amount,
          entry.date,
          entry.category.id,
        ];

        tx.executeSql(
          addSQL,
          data,
          (tnx, result) => {
            resolve({
              success: true,
              result: result,
            });
          },
          (tnx, error) => {
            resolve({
              success: false,
              result: error,
            });
          },
        );
      });
    });
  }

  updateEntry(entry) {
    return new Promise((resolve, reject) => {
      this.db.transaction((tx) => {
        const updateSQL = `UPDATE ${this.table} 
          SET 
          ${this.columns.title.title}=?,
          ${this.columns.description.title}=?,
          ${this.columns.amount.title}=?,
          ${this.columns.date.title}=?,
          ${this.columns.categoryId.title}=? 
          WHERE 
          ${this.columns.id.title}=?`;

        let data = [
          entry.title,
          entry.description,
          entry.amount,
          entry.date,
          entry.category.id,
          entry.id,
        ];

        tx.executeSql(
          updateSQL,
          data,
          (tnx, result) => {
            resolve({
              success: true,
              result: result,
            });
          },
          (tnx, error) => {
            resolve({
              success: false,
              result: error,
            });
          },
        );
      });
    });
  }

  deleteEntry(entry) {
    return new Promise((resolve, reject) => {
      this.db.transaction((tx) => {
        const deleteSQL = `DELETE FROM ${this.table} WHERE ${this.columns.id.title}=?`;

        tx.executeSql(
          deleteSQL,
          [entry.id],
          (tnx, result) => {
            resolve({
              success: true,
              result: result,
            });
          },
          (tnx, result) => {
            resolve({
              success: false,
              result: result,
            });
          },
        );
      });
    });
  }

  getYears(categories) {
    console.log('Fetching Years from Database');
    return new Promise((resolve, reject) => {
      this.db.transaction((tx) => {
        let getSQL = `SELECT distinct(strftime('%Y',${this.columns.date.title})) as date from ${this.table}  WHERE ${this.columns.categoryId.title} IN (${categories})
        order by date`;

        tx.executeSql(getSQL, [], (tnx, result) => {
          let temp = [];

          for (let i = 0; i < result.rows.length; i++) {
            temp.push(result.rows.item(i).date);
          }
          resolve(temp);
        });
      });
    });
  }

  getMonthsOfYear(year, categories) {
    return new Promise((resolve, reject) => {
      this.db.transaction((tx) => {
        let getSQL = `SELECT distinct(strftime('%m',${this.columns.date.title})) as date FROM ${this.table}
             where strftime('%Y',${this.columns.date.title})=? AND ${this.columns.categoryId.title} IN (${categories})
             order by date`;

        tx.executeSql(getSQL, [year], (tnx, result) => {
          let temp = [];

          for (let i = 0; i < result.rows.length; i++) {
            temp.push(result.rows.item(i).date);
          }

          resolve(temp);
        });
      });
    });
  }

  getDatesFromMonthAndYear(monthYear, categories) {
    console.log(`Fetching Dates for ${monthYear}`);

    return new Promise((resolve, reject) => {
      this.db.transaction((tx) => {
        const getSQL = `SELECT distinct(strftime('%d',${this.columns.date.title})) as date FROM ${this.table}
        where strftime('%m/%Y',${this.columns.date.title})=? and ${this.columns.categoryId.title} IN (${categories})
        order by date`;

        tx.executeSql(getSQL, [monthYear], (tnx, result) => {
          let temp = [];

          for (let i = 0; i < result.rows.length; i++) {
            temp.push(result.rows.item(i).date);
          }

          resolve(temp);
        });
      });
    });
  }

  getEntries(date, categories) {
    console.log('Fetching Entries');
    return new Promise((resolve, reject) => {
      this.db.transaction((tx) => {
        const getSQL = `SELECT 
          e.${this.columns.id.title} as id,
          e.${this.columns.categoryId.title} as categoryid,
          e.${this.columns.title.title} as title,
          e.${this.columns.description.title} as description,
          e.${this.columns.amount.title} as amount,
          e.${this.columns.date.title} as date,
          c.${this.catTable.columns.title.title} as cTitle,
          c.${this.catTable.columns.id.title} as cId,
          c.${this.catTable.columns.type.title} as cType
        FROM ${this.table} as e, ${this.catTable.name} as c
        where strftime('%d/%m/%Y',${this.columns.date.title})=?
        and categoryid=cId and categoryid IN (${categories}) order by id`;

        tx.executeSql(getSQL, [date], (tnx, result) => {
          let temp = [];

          for (let i = 0; i < result.rows.length; i++) {
            temp.push({
              id: result.rows.item(i).id,
              title: result.rows.item(i).title,
              description: result.rows.item(i).description,
              amount: result.rows.item(i).amount,
              date: result.rows.item(i).date,
              category: {
                id: result.rows.item(i).cId,
                title: result.rows.item(i).cTitle,
                type: result.rows.item(i).cType,
              },
            });
          }

          resolve(temp);
        });
      });
    });
  }

  getAllEntries() {
    console.log('Fetching Entries');
    return new Promise((resolve, reject) => {
      this.db.transaction((tx) => {
        const getSQL = `SELECT 
          e.${this.columns.id.title} as id,
          e.${this.columns.categoryId.title} as categoryid,
          e.${this.columns.title.title} as title,
          e.${this.columns.description.title} as description,
          e.${this.columns.amount.title} as amount,
          e.${this.columns.date.title} as date,
          c.${this.catTable.columns.title.title} as cTitle,
          c.${this.catTable.columns.id.title} as cId,
          c.${this.catTable.columns.type.title} as cType
        FROM ${this.table} as e, ${this.catTable.name} as c
        where categoryid=cId order by id`;

        tx.executeSql(getSQL, [], (tnx, result) => {
          let temp = [];

          for (let i = 0; i < result.rows.length; i++) {
            temp.push({
              id: result.rows.item(i).id,
              title: result.rows.item(i).title,
              description: result.rows.item(i).description,
              amount: result.rows.item(i).amount,
              date: result.rows.item(i).date,
              category: {
                id: result.rows.item(i).cId,
                title: result.rows.item(i).cTitle,
                type: result.rows.item(i).cType,
              },
            });
          }

          resolve(temp);
        });
      });
    });
  }

  getRecentEntries() {
    console.log('Fetching Recent Entries');
    return new Promise((resolve, reject) => {
      const limit = 50;
      this.db.transaction((tx) => {
        const getSQL = `SELECT 
          e.${this.columns.id.title} as id,
          e.${this.columns.categoryId.title} as categoryid,
          e.${this.columns.title.title} as title,
          e.${this.columns.description.title} as description,
          e.${this.columns.amount.title} as amount,
          e.${this.columns.date.title} as date,
          c.${this.catTable.columns.title.title} as cTitle,
          c.${this.catTable.columns.id.title} as cId,
          c.${this.catTable.columns.type.title} as cType
        FROM ${this.table} as e, ${this.catTable.name} as c
        where categoryid=cId order by id limit ${limit}`;

        tx.executeSql(getSQL, [], (tnx, result) => {
          let temp = [];

          for (let i = 0; i < result.rows.length; i++) {
            temp.push({
              id: result.rows.item(i).id,
              title: result.rows.item(i).title,
              description: result.rows.item(i).description,
              amount: result.rows.item(i).amount,
              date: result.rows.item(i).date,
              category: {
                id: result.rows.item(i).cId,
                title: result.rows.item(i).cTitle,
                type: result.rows.item(i).cType,
              },
            });
          }

          resolve(temp);
        });
      });
    });
  }

  getMonthTotal(monthAndYear, categories) {
    return new Promise((resolve, reject) => {
      this.db.transaction((tx) => {
        const getSQL = `SELECT sum(${this.columns.amount.title}) as total FROM ${this.table}
        where strftime('%m/%Y',${this.columns.date.title})=? AND ${this.columns.categoryId.title} IN (${categories})`;

        tx.executeSql(
          getSQL,
          [monthAndYear],
          (tnx, result) => {
            resolve(result.rows.item(0).total);
          },
          (tnx, error) => {
            resolve(0);
          },
        );
      });
    });
  }

  getCategoryTotal(category) {
    return new Promise((resolve, reject) => {
      this.db.transaction((tx) => {
        const getSQL = `SELECT 
          sum(e.${this.columns.amount.title}) as total
        FROM ${this.table} as e, ${this.catTable.name} as c
        where e.${this.columns.categoryId.title}=c.${this.catTable.columns.id.title} and c.${this.catTable.columns.type.title} = ?`;

        // console.log(getSQL);
        tx.executeSql(
          getSQL,
          [category],
          (tnx, result) => {
            let total = result.rows.item(0).total;

            if (total == null) total = 0;
            resolve(total);
          },
          (tnx, error) => {
            console.log('Error');
            resolve(0);
          },
        );
      });
    });
  }
}

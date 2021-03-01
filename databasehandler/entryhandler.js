import {openDatabase} from 'react-native-sqlite-storage';
import {DB} from './utils';

export default class EntryDBHandler {
  constructor() {
    this.db = openDatabase({name: DB.dbname});
    this.table = DB.tables.entries.name;
    this.columns = DB.tables.entries.columns;
  }

  addEntry(entry) {
    return new Promise((resolve, reject) => {
      this.db.transaction((tx) => {
        const addSQL = `INSERT INTO ${this.table} (
                    ${this.columns.title.title},
                    ${this.columns.description.title},
                    ${this.columns.amount.title},
                    ${this.columns.date.title},
                    ${this.columns.categoryId.title}
                ) VALUES (?,?,?,?,?)`;
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

  getYears(category) {
    return new Promise((resolve, reject) => {
      this.db.transaction((tx) => {
        const getSQL = `SELECT strftime('%Y',${this.columns.date.title}) as date from ${this.table} where ${this.columns.categoryId.title}=?`;

        tx.executeSql(getSQL, [category.id], (tnx, result) => {
          let temp = [];

          for (let i = 0; i < result.rows.length; i++) {
            temp.push(result.rows.item(i).date);
          }

          resolve(temp);
        });
      });
    });
  }

  getMonthsOfYear(year, category) {
    return new Promise((resolve, reject) => {
      this.db.transaction((tx) => {
        const getSQL = `SELECT strftime('%m/%Y',${this.columns.date.title}) as date FROM ${this.table}
             where ${this.columns.categoryId.title}=? AND strftime('%Y',${this.columns.date.title})=?`;

        tx.executeSql(getSQL, [category.id, year], (tnx, result) => {
          let temp = [];

          for (let i = 0; i < result.rows.length; i++) {
            temp.push(result.rows.item(i).date);
          }

          resolve(temp);
        });
      });
    });
  }

  getDatesFromMonthAndYear(monthYear, category) {
    return new Promise((resolve, reject) => {
      this.db.transaction((tx) => {
        const getSQL = `SELECT strftime('%d/%m/%Y',${this.columns.date}) as date FROM ${this.table}
        where ${this.columns.categoryId.title}=? AND strftime('%m/%Y',${this.columns.date.title})=?`;

        tx.executeSql(getSQL, [category.id, monthYear], (tnx, result) => {
          let temp = [];

          for (let i = 0; i < result.rows.length; i++) {
            temp.push(result.rows.item(i).date);
          }

          resolve(temp);
        });
      });
    });
  }

  getEntries(date, category) {
    return new Promise((resolve, reject) => {
      this.db.transaction((tx) => {
        const getSQL = `SELECT * FROM ${this.table}
        where ${this.columns.categoryId.title}=? AND strftime('%d/%m/%Y',${this.columns.date.title})=?`;

        tx.executeSql(getSQL, [category.id, date], (tnx, result) => {
          let temp = [];

          for (let i = 0; i < result.rows.length; i++) {
            temp.push({
              id: result.rows.item(i).id,
              title: result.rows.item(i).title,
              description: result.rows.item(i).description,
              amount: result.rows.item(i).amount,
              date: date,
              categoryId: result.rows.item(i).categoryId,
            });
          }

          resolve(temp);
        });
      });
    });
  }
}

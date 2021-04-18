import {openDatabase} from 'react-native-sqlite-storage';
import {DB} from './utils';

export default class CategoryDBHandler {
  constructor() {
    this.db = openDatabase({name: DB.dbname});
    this.table = DB.tables.categories.name;
    this.columns = DB.tables.categories.columns;
  }

  addCategory(category) {
    return new Promise((resolve, reject) => {
      this.db.transaction((tx) => {
        const addSQL = `INSERT INTO ${this.table} (${this.columns.title.title},${this.columns.type.title}) VALUES(?,?)`;

        tx.executeSql(
          addSQL,
          [category.title, category.type.toLowerCase()],
          (tnx, result) => {
            resolve({
              success: true,
              result: result,
            });
          },
          (tnx, error) => {
            resolve({
              success: true,
              result: error,
            });
          },
        );
      });
    });
  }

  categoryExists(categoryTitle, type) {
    return new Promise((resolve, reject) => {
      this.db.transaction((tx) => {
        const getSQL = `SELECT * FROM ${this.table} WHERE ${this.columns.title.title} = ? AND ${this.columns.type.title} = ?`;
        tx.executeSql(
          getSQL,
          [categoryTitle, type.toLowerCase()],
          (tnx, result) => {
            if (result.rows.length == 0) {
              resolve(false);
            } else {
              resolve(true);
            }
          },
          (tnx, error) => {
            console.error(error);
          },
        );
      });
    });
  }

  getCategories(type) {
    return new Promise((resolve, reject) => {
      this.db.transaction((tx) => {
        const getSQL = `SELECT * FROM ${this.table} WHERE ${this.columns.type.title} = ?`;

        tx.executeSql(getSQL, [type.toLowerCase()], (tnx, result) => {
          let temp = [];

          for (let i = 0; i < result.rows.length; i++) {
            temp.push({
              id: result.rows.item(i).id,
              title: result.rows.item(i).title,
              type: type,
            });
          }

          resolve(temp);
        });
      });
    });
  }

  getAllCategories() {
    return new Promise((resolve, reject) => {
      this.db.transaction((tx) => {
        const getSQL = `SELECT * FROM ${this.table}`;

        tx.executeSql(getSQL, [], (tnx, result) => {
          let temp = [];

          for (let i = 0; i < result.rows.length; i++) {
            temp.push({
              id: result.rows.item(i).id,
              title: result.rows.item(i).title,
              type: type,
            });
          }

          resolve(temp);
        });
      });
    });
  }
}

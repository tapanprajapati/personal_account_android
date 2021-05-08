import {openDatabase} from 'react-native-sqlite-storage';
import {DB} from './utils';

export default class CategoryDBHandler {
  constructor() {
    this.db = openDatabase({name: DB.dbname});
    this.table = DB.tables.categories.name;
    this.columns = DB.tables.categories.columns;
    this.entryTable = DB.tables.entries;
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
    console.log(`Getting categories for ${type}`);
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
    console.log('Getting Categories');
    return new Promise((resolve, reject) => {
      this.db.transaction((tx) => {
        const getSQL = `SELECT * FROM ${this.table}`;

        tx.executeSql(getSQL, [], (tnx, result) => {
          let temp = [];

          for (let i = 0; i < result.rows.length; i++) {
            temp.push({
              id: result.rows.item(i).id,
              title: result.rows.item(i).title,
              type: result.rows.item(i).type,
            });
          }

          resolve(temp);
        });
      });
    });
  }

  getCategoryTotalByYear(year, type) {
    return new Promise((resolve, reject) => {
      console.log(`${type} categories total of ${year}`);

      this.db.transaction((tx) => {
        const getSQL = `SELECT 
        sum(e.${this.entryTable.columns.amount.title}) as total,
        c.${this.columns.id.title} as id,
        c.${this.columns.title.title} as title
        FROM ${this.table} as c, ${this.entryTable.name} as e
        where c.${this.columns.id.title}=e.${this.entryTable.columns.categoryId.title} 
        and c.${this.columns.type.title} = ? 
        and strftime('%Y',e.${this.entryTable.columns.date.title})=? 
        group by c.${this.columns.id.title}`;

        tx.executeSql(
          getSQL,
          [type, year],
          (tnx, result) => {
            let listCategories = [];
            for (let i = 0; i < result.rows.length; i++) {
              let total = result.rows.item(i).total;
              if (total == null) total = 0;

              total = parseInt(total);

              let title = result.rows.item(i).title;
              let id = result.rows.item(i).id;

              listCategories.push({
                id: id,
                title: title,
                total: total,
              });
            }

            resolve(listCategories);
          },
          (tnx, error) => {
            console.error('Error');
            console.error(error);
            resolve(0);
          },
        );
      });
    });
  }

  getCategoryTotalByMonthYear(monthYear, type) {
    return new Promise((resolve, reject) => {
      console.log(`${type} categories total of ${monthYear}`);

      this.db.transaction((tx) => {
        const getSQL = `SELECT 
        sum(e.${this.entryTable.columns.amount.title}) as total,
        c.${this.columns.id.title} as id,
        c.${this.columns.title.title} as title
        FROM ${this.table} as c, ${this.entryTable.name} as e
        where c.${this.columns.id.title}=e.${this.entryTable.columns.categoryId.title} 
        and c.${this.columns.type.title} = ? 
        and strftime('%m/%Y',e.${this.entryTable.columns.date.title})=? 
        group by c.${this.columns.id.title}`;

        tx.executeSql(
          getSQL,
          [type, monthYear],
          (tnx, result) => {
            let listCategories = [];
            for (let i = 0; i < result.rows.length; i++) {
              let total = result.rows.item(i).total;
              if (total == null) total = 0;

              total = parseInt(total);

              let title = result.rows.item(i).title;
              let id = result.rows.item(i).id;

              listCategories.push({
                id: id,
                title: title,
                total: total,
              });
            }

            resolve(listCategories);
          },
          (tnx, error) => {
            console.error('Error');
            console.error(error);
            resolve(0);
          },
        );
      });
    });
  }

  getCategoryTotal(type) {
    return new Promise((resolve, reject) => {
      console.log(`${type} categories total`);

      this.db.transaction((tx) => {
        const getSQL = `SELECT 
        sum(e.${this.entryTable.columns.amount.title}) as total,
        c.${this.columns.id.title} as id,
        c.${this.columns.title.title} as title
        FROM ${this.table} as c, ${this.entryTable.name} as e
        where c.${this.columns.id.title}=e.${this.entryTable.columns.categoryId.title} 
        and c.${this.columns.type.title} = ? 
        group by c.${this.columns.id.title}`;

        tx.executeSql(
          getSQL,
          [type],
          (tnx, result) => {
            let listCategories = [];
            for (let i = 0; i < result.rows.length; i++) {
              let total = result.rows.item(i).total;
              if (total == null) total = 0;

              total = parseInt(total);

              let title = result.rows.item(i).title;
              let id = result.rows.item(i).id;

              listCategories.push({
                id: id,
                title: title,
                total: total,
              });
            }

            resolve(listCategories);
          },
          (tnx, error) => {
            console.error('Error');
            console.error(error);
            resolve(0);
          },
        );
      });
    });
  }
}

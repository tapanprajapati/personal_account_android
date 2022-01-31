import {openDatabase} from 'react-native-sqlite-storage';
import api from '../utils/api';
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
      console.log('Starting transaction');
      fetch(api.category.create,{
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body:JSON.stringify({
          title: category.title,
          type: category.type,
          groupid: "1640932481964",
        })
      })
      .then((response)=>response.json())
      .then(json=>{
        resolve(json)
      })
      .catch(error=>
        reject(error))
    });
  }

  importCategory(category) {
    return new Promise((resolve, reject) => {
      this.db.transaction((tx) => {
        const addSQL = `INSERT INTO ${this.table} (${this.columns.id.title},${this.columns.title.title},${this.columns.type.title}) VALUES(?,?,?)`;

        tx.executeSql(
          addSQL,
          [category.id, category.title, category.type.toLowerCase()],
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

  updateCategory(newTitle, id,type) {
    return new Promise((resolve, reject) => {
      console.log('Update category: '+id);
      const updateAPI = `${api.category.rename}${id}?title=${newTitle}&type=${type}&groupid=1640932481964`;
      console.log(updateAPI);
      fetch(updateAPI,{
        method: 'put',
      })
      .then((response)=>response.json())
      .then(json=>{
        console.log(json)
        resolve(json)
      })
      .catch(error=>
        reject(error))
    });
  }

  deleteCategory(id) {
    return new Promise((resolve, reject) => {
      console.log('Delete category: '+id);
      fetch(`${api.category.delete}${id}`,{
        method: 'delete',
      })
      .then((response)=>response.json())
      .then(json=>{
        resolve(json)
      })
      .catch(error=>
        reject(error))
    });
  }

  transferCategory(sourceID, targetID) {
    return new Promise((resolve, reject) => {
      console.log('Transfer category: '+sourceID +"to id "+targetID);
      const transferAPI = `${api.category.transfer}${sourceID}?to=${targetID}`;
      console.log(transferAPI);
      fetch(transferAPI,{
        method: 'put',
      })
      .then((response)=>response.json())
      .then(json=>{
        console.log(json)
        resolve(json)
      })
      .catch(error=>
        reject(error))
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
    const getAPI = `${api.category.getByType}${type}`;
    console.log(`${getAPI}`)

    return new Promise((resolve, reject)=>{
      fetch(getAPI)
      .then((response)=>response.json())
      .then(json=>{
        const message = json.message;
        resolve(message)
      }).catch(error=>{
        console.log(error)
      })
    })
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

  getAllCategoriesTotal(type,date) {
    console.log(`Getting total for all categories: ${type}`);
    const getAPI = `${api.summary.getAllCategoriesTotal}${type}?date=${date}&groupid=1640932481964`;
    console.log(`${getAPI}`)

    return new Promise((resolve, reject)=>{
      fetch(getAPI)
      .then((response)=>response.json())
      .then(json=>{
        const message = json.message;
        resolve(message)
      }).catch(error=>{
        console.log(error)
      })
    })
  }

  getTypeTotal(type,date) {
    console.log(`Getting total for type: ${type}`);
    const getAPI = `${api.summary.getTypeTotal}${type}?date=${date}&groupid=1640932481964`;
    console.log(`${getAPI}`)

    return new Promise((resolve, reject)=>{
      fetch(getAPI)
      .then((response)=>response.json())
      .then(json=>{
        const message = json.message;
        resolve(message)
      }).catch(error=>{
        console.log(error)
      })
    })
  }
}

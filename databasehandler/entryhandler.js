import {openDatabase} from 'react-native-sqlite-storage';
import {DB} from './utils';
import './../utils/api/endpoints'
import endpoints from './../utils/api/endpoints';

export default class EntryDBHandler {
  constructor() {
    this.db = openDatabase({name: DB.dbname});
    this.table = DB.tables.entries.name;
    this.columns = DB.tables.entries.columns;
    this.catTable = DB.tables.categories;
  }

  importEntry(entry) {
    console.log('In handler');
    return new Promise((resolve, reject) => {
      console.log('Starting transaction');
      this.db.transaction((tx) => {
        const addSQL = `INSERT INTO ${this.table} (${this.columns.id.title},${this.columns.title.title},${this.columns.description.title},${this.columns.amount.title},${this.columns.date.title},${this.columns.categoryId.title}) VALUES (?,?,?,?,?,?)`;
        let data = [
          entry.id,
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

  addEntry(entry) {
    console.log('In handler');
    return new Promise((resolve, reject) => {
      console.log('Starting transaction');
      fetch(endpoints.entry.createEntry,{
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body:JSON.stringify({
          title: entry.title,
          description: entry.description,
          amount: parseFloat(entry.amount),
          date: entry.date,
          categoryid: entry.category.id,
          username: "tapan"
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

  getYears() {
    console.log('Fetching Years from Database');
    return new Promise((resolve, reject) => {
      this.db.transaction((tx) => {
        let getSQL = `SELECT distinct(strftime('%Y',${this.columns.date.title})) as date from ${this.table} order by date`;

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

  getMonths(year) {
    return new Promise((resolve, reject) => {
      this.db.transaction((tx) => {
        let getSQL = `SELECT distinct(strftime('%m',${this.columns.date.title})) as date from ${this.table}
        where strftime('%Y',${this.columns.date.title})=?
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

  getSearchYears(searchString, categories) {
    console.log('Fetching Years from Database');
    return new Promise((resolve, reject) => {
      fetch(`${endpoints.entry.getYears}?search=${searchString}&categories=${categories}`)
      .then((response)=>response.json())
      .then(json=>{
        resolve(json.message)
      })
      .catch(error=>{
        reject(error)
      })
    });
  }

  getSearchMonthsOfYear(searchString, year, categories) {
    console.log('Fetching months from Database');
    console.log(`${endpoints.entry.getMonths}?search=${searchString}&categories=${categories}&date=${year}`)
    return new Promise((resolve, reject) => {
      fetch(`${endpoints.entry.getMonths}?search=${searchString}&categories=${categories}&date=${year}`)
      .then((response)=>response.json())
      .then(json=>{
        console.log(json.message)
        resolve(json.message)
      })
      .catch(error=>{
        reject(error)
      })
    });
  }

  getSearchDatesFromMonthAndYear(searchString, monthYear, categories) {
    console.log('Fetching dates from Database');
    console.log(`${endpoints.entry.getDates}?search=${searchString}&categories=${categories}&date=${monthYear}`);
    return new Promise((resolve, reject) => {
      fetch(`${endpoints.entry.getDates}?search=${searchString}&categories=${categories}&date=${monthYear}`)
      .then((response)=>response.json())
      .then(json=>{
        console.log(json.message)
        resolve(json.message)
      })
      .catch(error=>{
        reject(error)
      })
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
        where categoryid=cId order by id desc limit ${limit}`;

        tx.executeSql(getSQL, [], (tnx, result) => {
          resolve(this.fromEntries(result));
        });
      });
    });
  }

  fromEntries(result) {
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
    return temp;
  }

  
  getSearchEntriesByDate(searchString, date, categories) {
    console.log('Fetching entries from Database');
    console.log(`${endpoints.entry.getEntries}?search=${searchString}&categories=${categories}&date=${date}`)
    return new Promise((resolve, reject) => {
      fetch(`${endpoints.entry.getEntries}?search=${searchString}&categories=${categories}&date=${date}`)
      .then((response)=>response.json())
      .then(json=>{
        console.log(json.message)
        resolve(json.message)
      })
      .catch(error=>{
        reject(error)
      })
    });
  }
  
  getSearchYearTotal(searchString, year, categories) {
    console.log('Fetching year total from Database');
    console.log(`${endpoints.entry.getYearTotal}?search=${searchString}&categories=${categories}&date=${year}`)
    return new Promise((resolve, reject) => {
      fetch(`${endpoints.entry.getYearTotal}?search=${searchString}&categories=${categories}&date=${year}`)
      .then((response)=>response.json())
      .then(json=>{
        console.log(json.message)
        resolve(json.message)
      })
      .catch(error=>{
        reject(error)
      })
    });
  }

  getSearchMonthTotal(searchString, monthAndYear, categories) {
    console.log('Fetching month total from Database');
    console.log(`${endpoints.entry.getMonthTotal}?search=${searchString}&categories=${categories}&date=${monthAndYear}`)
    return new Promise((resolve, reject) => {
      fetch(`${endpoints.entry.getMonthTotal}?search=${searchString}&categories=${categories}&date=${monthAndYear}`)
      .then((response)=>response.json())
      .then(json=>{
        console.log(json.message)
        resolve(json.message)
      })
      .catch(error=>{
        reject(error)
      })
    });
  }

  getSearchDateTotal(searchString, date, categories) {
    console.log('Fetching date total from Database');
    console.log(`${endpoints.entry.getDateTotal}?search=${searchString}&categories=${categories}&date=${date}`)
    return new Promise((resolve, reject) => {
      fetch(`${endpoints.entry.getDateTotal}?search=${searchString}&categories=${categories}&date=${date}`)
      .then((response)=>response.json())
      .then(json=>{
        console.log(json.message)
        resolve(json.message)
      })
      .catch(error=>{
        reject(error)
      })
    });
  }


  getMonthTotal(month, type) {
    return new Promise((resolve, reject) => {
      this.db.transaction((tx) => {
        const getSQL = `SELECT
        sum(e.${this.columns.amount.title}) as total
        FROM ${this.table} as e, ${this.catTable.name} as c
        where e.${this.columns.categoryId.title}=c.${this.catTable.columns.id.title}
        and c.${this.catTable.columns.type.title} = ?
        and strftime('%m/%Y',e.${this.columns.date.title})=?`;

        tx.executeSql(
          getSQL,
          [type, month],
          (tnx, result) => {
            let total = result.rows.item(0).total;

            if (total == null) {
              total = 0;
            }
            resolve(total.toFixed(2));
          },
          (tnx, error) => {
            console.log('Error');
            resolve(0);
          },
        );
      });
    });
  }

  getYearsTotal(year, type) {
    return new Promise((resolve, reject) => {
      console.log(`${type} total of ${year}`);

      this.db.transaction((tx) => {
        const getSQL = `SELECT 
        sum(e.${this.columns.amount.title}) as total
        FROM ${this.table} as e, ${this.catTable.name} as c
        where e.${this.columns.categoryId.title}=c.${this.catTable.columns.id.title} 
        and c.${this.catTable.columns.type.title} = ? 
        and strftime('%Y',e.${this.columns.date.title})=?`;

        tx.executeSql(
          getSQL,
          [type, year],
          (tnx, result) => {
            let total = result.rows.item(0).total;
            if (total == null) {
              total = 0;
            }

            resolve(total.toFixed(2));
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

            if (total == null) {
              total = 0;
            }
            resolve(total.toFixed(2));
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

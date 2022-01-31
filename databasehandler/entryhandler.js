import {openDatabase} from 'react-native-sqlite-storage';
import api from '../utils/api';
import {DB} from './utils';

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
      fetch(api.entry.createEntry,{
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
          username: entry.username
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
      console.log('Starting transaction to update entry');
      fetch(api.entry.updateEntry,{
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body:JSON.stringify({
          id: entry.id,
          title: entry.title,
          description: entry.description,
          amount: parseFloat(entry.amount),
          date: entry.date,
          categoryid: entry.category.id,
          username: entry.username
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

  deleteEntry(entry) {
    return new Promise((resolve, reject) => {
      console.log('Delete entry '+entry);
      fetch(`${api.entry.deleteEntry}${entry.id}`,{
        method: 'DELETE',
      })
      .then((response)=>response.json())
      .then(json=>{
        resolve(json)
      })
      .catch(error=>
        reject(error))
    });
  }

  getYears() {
    console.log('Fetching All Years from Database');
    return new Promise((resolve, reject) => {
      fetch(`${api.summary.getAllYears}`)
      .then((response)=>response.json())
      .then(json=>{
        resolve(json.message)
      })
      .catch(error=>{
        reject(error)
      })
    });
  }

  getMonths(year) {
    console.log('Fetching All Months from Database for year: '+year);
    return new Promise((resolve, reject) => {
      fetch(`${api.summary.getAllMonths}date=${year}`)
      .then((response)=>response.json())
      .then(json=>{
        resolve(json.message)
      })
      .catch(error=>{
        reject(error)
      })
    });
  }

  getSearchYears(searchString, categories) {
    console.log('Fetching Years from Database');
    return new Promise((resolve, reject) => {
      fetch(`${api.summary.getYears}search=${searchString}&categories=${categories}`)
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
    const getAPI = `${api.summary.getMonths}search=${searchString}&categories=${categories}&date=${year}`
    console.log(getAPI)
    return new Promise((resolve, reject) => {
      fetch(getAPI)
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
    const getAPI = `${api.summary.getDates}search=${searchString}&categories=${categories}&date=${monthYear}`;
    console.log(getAPI);
    return new Promise((resolve, reject) => {
      fetch(getAPI)
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

    for (let i = 0; i < result.length; i++) {
      temp.push({
        id: result[i].id,
        title: result[i].title,
        description: result[i].description,
        amount: result[i].amount,
        date: result[i].date,
        username: result[i].username,
        category: {
          id: result[i].cId,
          title: result[i].cTitle,
          type: result[i].cType,
        },
      });
    }
    return temp;
  }

  
  getSearchEntriesByDate(searchString, date, categories) {
    console.log('Fetching entries from Database');
    const getAPI = `${api.entry.getEntries}search=${searchString}&categories=${categories}&date=${date}`
    console.log(getAPI)
    return new Promise((resolve, reject) => {
      fetch(getAPI)
      .then((response)=>response.json())
      .then(json=>{
        console.log(json.message)
        resolve(this.fromEntries(json.message))
      })
      .catch(error=>{
        reject(error)
      })
    });
  }
  
  getSearchYearTotal(searchString, year, categories) {
    console.log('Fetching year total from Database');
    const getAPI = `${api.summary.getYearTotal}search=${searchString}&categories=${categories}&date=${year}`
    console.log(getAPI)
    return new Promise((resolve, reject) => {
      fetch(getAPI)
      .then((response)=>response.json())
      .then(json=>{
        console.log(json.message)
        if(json.success)
        {
          resolve(json.message)
        }
        else
        {
          reject(json.message)
        }
      })
      .catch(error=>{
        reject(error)
      })
    });
  }

  getSearchMonthTotal(searchString, monthAndYear, categories) {
    console.log('Fetching month total from Database');
    const getAPI = `${api.summary.getMonthTotal}search=${searchString}&categories=${categories}&date=${monthAndYear}`
    console.log(getAPI)
    return new Promise((resolve, reject) => {
      fetch(getAPI)
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
    const getAPI = `${api.summary.getDateTotal}?search=${searchString}&categories=${categories}&date=${date}`
    console.log(getAPI)
    return new Promise((resolve, reject) => {
      fetch(getAPI)
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
}

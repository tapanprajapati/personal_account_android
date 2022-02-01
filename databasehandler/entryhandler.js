import API from "../utils/api";


export default class EntryDBHandler {
  constructor() {
    if(EntryDBHandler._instance)
    {
      return EntryDBHandler._instance;
    }
    EntryDBHandler._instance = this;
    this.api = new API()
    return EntryDBHandler._instance;
  }

  addEntry(entry) {
    console.log('In handler');
    return new Promise((resolve, reject) => {
      console.log('Starting transaction');
      fetch(this.api.entry.createEntry(),{
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
      fetch(this.api.entry.updateEntry(),{
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
      fetch(`${this.api.entry.deleteEntry()}${entry.id}`,{
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
    return new Promise((resolve, reject) => {
      console.log('Fetching All Years from Database');
      console.log(this.api.summary.getAllYears())
      fetch(`${this.api.summary.getAllYears()}`)
      .then((response)=>response.json())
      .then(json=>{
        console.log(json.message);
        resolve(json.message)
      })
      .catch(error=>{
        reject(error)
      })
    });
  }

  getMonths(year) {
    return new Promise((resolve, reject) => {
      console.log('Fetching All Months from Database for year: '+year);
      console.log(`${this.api.summary.getAllMonths()}date=${year}`);
      fetch(`${this.api.summary.getAllMonths()}date=${year}`)
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

  getSearchYears(searchString, categories) {
    return new Promise((resolve, reject) => {
      console.log('Fetching Years from Database');
      fetch(`${this.api.summary.getYears()}search=${searchString}&categories=${categories}`)
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
    const getAPI = `${this.api.summary.getMonths()}search=${searchString}&categories=${categories}&date=${year}`
    return new Promise((resolve, reject) => {
      console.log('Fetching months from Database');
      console.log(getAPI)
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
    const getAPI = `${this.api.summary.getDates()}search=${searchString}&categories=${categories}&date=${monthYear}`;
    return new Promise((resolve, reject) => {
      console.log('Fetching dates from Database');
      console.log(getAPI);
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
    const getAPI = `${this.api.entry.recentEntries()}${50}`
    return new Promise((resolve, reject) => {
      console.log('Fetching recent entries from Database');
      console.log(getAPI)
      fetch(getAPI)
      .then((response)=>response.json())
      .then(json=>{
        resolve(this.fromEntries(json.message))
      })
      .catch(error=>{
        reject(error)
      })
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
    const getAPI = `${this.api.entry.getEntries()}search=${searchString}&categories=${categories}&date=${date}`
    return new Promise((resolve, reject) => {
      console.log('Fetching entries from Database');
      console.log(getAPI)
      fetch(getAPI)
      .then((response)=>response.json())
      .then(json=>{
        resolve(this.fromEntries(json.message))
      })
      .catch(error=>{
        reject(error)
      })
    });
  }
  
  getSearchYearTotal(searchString, year, categories) {
    const getAPI = `${this.api.summary.getYearTotal()}search=${searchString}&categories=${categories}&date=${year}`
    return new Promise((resolve, reject) => {
      console.log('Fetching year total from Database');
      console.log(getAPI)
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
    const getAPI = `${this.api.summary.getMonthTotal()}search=${searchString}&categories=${categories}&date=${monthAndYear}`
    return new Promise((resolve, reject) => {
      console.log('Fetching month total from Database');
      console.log(getAPI)
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
    const getAPI = `${this.api.summary.getDateTotal()}?search=${searchString}&categories=${categories}&date=${date}`
    return new Promise((resolve, reject) => {
      console.log('Fetching date total from Database');
      console.log(getAPI)
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
    const getAPI = `${this.api.summary.getMonthTotalAllCategories()}&type=${type}&date=${month}&groupid=1640932481964`
    return new Promise((resolve, reject) => {
      console.log('Fetching month total for all categories from Database');
      console.log(getAPI)
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

  getYearsTotal(year, type) {
    const getAPI = `${this.api.summary.getYearTotalAllCategories()}&type=${type}&date=${year}&groupid=1640932481964`
    return new Promise((resolve, reject) => {
      console.log('Fetching year total for all categories from Database');
      console.log(getAPI)
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
}

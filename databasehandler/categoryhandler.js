import API from "../utils/api";


export default class CategoryDBHandler {
  constructor() {
    if(CategoryDBHandler._instance)
    {
      return CategoryDBHandler._instance;
    }
    CategoryDBHandler._instance = this;
    this.api = new API()
    return CategoryDBHandler._instance;
  }

  addCategory(category) {
    return new Promise((resolve, reject) => {
      console.log('Starting transaction');
      fetch(this.api.category.create(),{
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

  updateCategory(newTitle, id,type) {
    return new Promise((resolve, reject) => {
      console.log('Update category: '+id);
      const updateAPI = `${this.api.category.rename()}${id}?title=${newTitle}&type=${type}&groupid=1640932481964`;
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
      fetch(`${this.api.category.delete()}${id}`,{
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
      const transferAPI = `${this.api.category.transfer()}${sourceID}?to=${targetID}`;
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

  // categoryExists(categoryTitle, type) {
  //   return new Promise((resolve, reject) => {
  //     this.db.transaction((tx) => {
  //       const getSQL = `SELECT * FROM ${this.table} WHERE ${this.columns.title.title} = ? AND ${this.columns.type.title} = ?`;
  //       tx.executeSql(
  //         getSQL,
  //         [categoryTitle, type.toLowerCase()],
  //         (tnx, result) => {
  //           if (result.rows.length == 0) {
  //             resolve(false);
  //           } else {
  //             resolve(true);
  //           }
  //         },
  //         (tnx, error) => {
  //           console.error(error);
  //         },
  //       );
  //     });
  //   });
  // }

  getCategories(type) {
    console.log(`Getting categories for ${type}`);
    const getAPI = `${this.api.category.getByType()}${type}`;
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

  // getAllCategories() {
  //   console.log('Getting Categories');
  //   return new Promise((resolve, reject) => {
  //     this.db.transaction((tx) => {
  //       const getSQL = `SELECT * FROM ${this.table}`;

  //       tx.executeSql(getSQL, [], (tnx, result) => {
  //         let temp = [];

  //         for (let i = 0; i < result.rows.length; i++) {
  //           temp.push({
  //             id: result.rows.item(i).id,
  //             title: result.rows.item(i).title,
  //             type: result.rows.item(i).type,
  //           });
  //         }

  //         resolve(temp);
  //       });
  //     });
  //   });
  // }

  getCategoryTotal(type) {
    console.log(`Getting total for all categories: ${type}`);
    const getAPI = `${this.api.summary.getAllCategoriesTotal()}${type}?groupid=1640932481964`;
    console.log(`${getAPI}`)

    return new Promise((resolve, reject)=>{
      fetch(getAPI)
      .then((response)=>response.json())
      .then(json=>{
        const message = json.message;
        console.log(message)
        resolve(message)
      }).catch(error=>{
        console.log(error)
      })
    })
  }

  getAllCategoriesTotalMonth(type,date) {
    console.log(`Getting total for all categories: ${type}`);
    const getAPI = `${this.api.summary.getAllCategoriesTotalMonth()}${type}?date=${date}&groupid=1640932481964`;
    console.log(`${getAPI}`)

    return new Promise((resolve, reject)=>{
      fetch(getAPI)
      .then((response)=>response.json())
      .then(json=>{
        const message = json.message;
        console.log(message)
        resolve(message)
      }).catch(error=>{
        console.log(error)
      })
    })
  }

  getAllCategoriesTotalYear(type,date) {
    console.log(`Getting total for all categories: ${type}`);
    const getAPI = `${this.api.summary.getAllCategoriesTotalYear()}${type}?date=${date}&groupid=1640932481964`;
    console.log(`${getAPI}`)

    return new Promise((resolve, reject)=>{
      fetch(getAPI)
      .then((response)=>response.json())
      .then(json=>{
        const message = json.message;
        console.log(message)
        resolve(message)
      }).catch(error=>{
        console.log(error)
      })
    })
  }


  getTypeTotal(type,date) {
    console.log(`Getting total for type: ${type}`);
    const getAPI = `${this.api.summary.getTypeTotal()}${type}?date=${date}&groupid=1640932481964`;
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

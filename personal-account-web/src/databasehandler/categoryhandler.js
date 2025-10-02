import API from "../utils/api";

//TODO: Handle unsuccessful API calls properly

export default class CategoryDBHandler {
  constructor() {
    if (CategoryDBHandler._instance) {
      return CategoryDBHandler._instance;
    }
    CategoryDBHandler._instance = this;
    this.api = new API();
    return CategoryDBHandler._instance;
  }

  addCategory(category) {
    return new Promise((resolve, reject) => {
      console.log('Starting transaction');
      fetch(this.api.category.create(), {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: category.title,
          type: category.type,
          groupid: "1640932481964",
          allowance: category.allowance
        })
      })
        .then((response) => response.json())
        .then(json => {
          resolve(json);
        })
        .catch(error =>
          reject(error));
    });
  }

  updateCategory(newTitle, allowance = 0, id, type) {
    return new Promise((resolve, reject) => {
      console.log('Update category: ' + id);
      const updateAPI = `${this.api.category.update()}${id}?title=${newTitle}&type=${type}&groupid=1640932481964&allowance=${allowance}`;
      console.log(updateAPI);
      fetch(updateAPI, {
        method: 'put',
      })
        .then((response) => response.json())
        .then(json => {
          console.log(json);
          resolve(json);
        })
        .catch(error =>
          reject(error));
    });
  }

  deleteCategory(id) {
    return new Promise((resolve, reject) => {
      console.log('Delete category: ' + id);
      fetch(`${this.api.category.delete()}${id}`, {
        method: 'delete',
      })
        .then((response) => response.json())
        .then(json => {
          resolve(json);
        })
        .catch(error =>
          reject(error));
    });
  }

  transferCategory(sourceID, targetID) {
    return new Promise((resolve, reject) => {
      console.log('Transfer category: ' + sourceID + "to id " + targetID);
      const transferAPI = `${this.api.category.transfer()}${sourceID}?to=${targetID}`;
      console.log(transferAPI);
      fetch(transferAPI, {
        method: 'put',
      })
        .then((response) => response.json())
        .then(json => {
          console.log(json);
          resolve(json);
        })
        .catch(error =>
          reject(error));
    });
  }

  getCategories(type) {
    console.log(`Getting categories for ${type}`);
    const getAPI = `${this.api.category.getByType()}${type}`;
    console.log(`${getAPI}`);

    return new Promise((resolve, reject) => {
      fetch(getAPI)
        .then((response) => response.json())
        .then(json => {
          resolve(json);
        }).catch(error => {
          console.log(error);
          reject(error);
        });
    });
  }

  getCategoryTotal(type) {
    console.log(`Getting total for all categories: ${type}`);
    const getAPI = `${this.api.summary.getAllCategoriesTotal()}${type}?groupid=1640932481964`;
    console.log(`${getAPI}`);

    return new Promise((resolve, reject) => {
      fetch(getAPI)
        .then((response) => response.json())
        .then(json => {
          console.log(json);
          resolve(json);
        }).catch(error => {
          console.log(error);
          reject(error);
        });
    });
  }

  getAllCategoriesTotalMonth(type, date) {
    console.log(`Getting total for all categories: ${type}`);
    const getAPI = `${this.api.summary.getAllCategoriesTotalMonth()}${type}?date=${date}&groupid=1640932481964`;
    console.log(`${getAPI}`);

    return new Promise((resolve, reject) => {
      fetch(getAPI)
        .then((response) => response.json())
        .then(json => {
          console.log(json);
          resolve(json);
        }).catch(error => {
          console.log(error);
          reject(error);
        });
    });
  }

  getAllCategoriesTotalYear(type, date) {
    console.log(`Getting total for all categories: ${type}`);
    const getAPI = `${this.api.summary.getAllCategoriesTotalYear()}${type}?date=${date}&groupid=1640932481964`;
    console.log(`${getAPI}`);

    return new Promise((resolve, reject) => {
      fetch(getAPI)
        .then((response) => response.json())
        .then(json => {
          console.log(json);
          resolve(json);
        }).catch(error => {
          console.log(error);
          reject(error);
        });
    });
  }

  getTypeTotal(type, date) {
    console.log(`Getting total for type: ${type}`);
    const getAPI = `${this.api.summary.getTypeTotal()}${type}?date=${date}&groupid=1640932481964`;
    console.log(`${getAPI}`);

    return new Promise((resolve, reject) => {
      fetch(getAPI)
        .then((response) => response.json())
        .then(json => {
          console.log(json);
          resolve(json);
        }).catch(error => {
          console.log(error);
          reject(error);
        });
    });
  }
}

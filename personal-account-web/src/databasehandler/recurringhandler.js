import API from "../utils/api";

//TODO: Handle unsuccessful API calls properly

export default class RecurringDBHandler {
  constructor() {
    if (RecurringDBHandler._instance) {
      return RecurringDBHandler._instance;
    }
    RecurringDBHandler._instance = this;
    this.api = new API();
    return RecurringDBHandler._instance;
  }

  createRecurring(recurring) {
    return new Promise((resolve, reject) => {
      console.log('Creating Recurring:');
      fetch(this.api.recurring.create(), {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
        body: {
          title: recurring.title,
          description: recurring.description,
          amount: recurring.amount,
          start_date: recurring.start_date,
          freq: recurring.freq,
          categoryid: recurring.categoryid,
          username: recurring.username,
        }
      })
        .then((response) => response.json())
        .then(json => {
          resolve(json);
        })
        .catch(error =>
          reject(error));
    });
  }

  updateRecurring(recurring) {
    return new Promise((resolve, reject) => {
      console.log('Update recurring: ' + recurring.id);
      const updateAPI = `${this.api.recurring.update()}`;
      console.log(updateAPI);
      fetch(updateAPI, {
        method: 'put',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
        body: {
          title: recurring.title,
          description: recurring.description,
          amount: recurring.amount,
          freq: recurring.freq,
          categoryid: recurring.categoryid,
          username: recurring.username,
        }
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

  deleteRecurring(id) {
    return new Promise((resolve, reject) => {
      console.log('Delete recurring: ' + id);
      fetch(`${this.api.recurring.delete()}${id}`, {
        method: 'delete',
        headers: {
          'ngrok-skip-browser-warning': 'true'
        }
      })
        .then((response) => response.json())
        .then(json => {
          resolve(json);
        })
        .catch(error =>
          reject(error));
    });
  }

  getRecurrings() {
    console.log(`Getting recurrings`);
    const getAPI = `${this.api.recurring.get()}`;
    console.log(`${getAPI}`);

    return new Promise((resolve, reject) => {
      fetch(getAPI, {
        headers: {
          'ngrok-skip-browser-warning': 'true'
        }
      })
        .then((response) => response.json())
        .then(json => {
          resolve(json);
        }).catch(error => {
          console.log(error);
          reject(error);
        });
    });
  }
}

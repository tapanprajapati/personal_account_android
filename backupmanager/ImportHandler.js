import RNFS from 'react-native-fs';
import CategoryDBHandler from '../databasehandler/categoryhandler';
import EntryDBHandler from '../databasehandler/entryhandler';

export function ImportHandler() {
  this.entryHandler = new EntryDBHandler();
  this.categoryHandler = new CategoryDBHandler();
}

ImportHandler.prototype.saveData = function (file) {
  RNFS.readFile(file).then((content) => {
    const data = JSON.parse(content);
    this.saveCategories(data.categories);
    this.saveEntries(data.entries);
  });
};

ImportHandler.prototype.saveCategories = function (categories) {
  categories.forEach((category) => {
    this.categoryHandler.addCategory(category).then((result) => {
      console.log(result.success);
    });
  });
};

ImportHandler.prototype.saveEntries = function (entries) {
  entries.forEach((entry) => {
    this.entryHandler.addEntry(entry).then((result) => {
      console.log(result.success);
    });
  });
};

function hasKeys(obj, keyList) {
  const keysInObj = Object.keys(obj);

  keyList.forEach((key) => {
    if (!keysInObj.includes(key)) {
      return false;
    }
  });

  return true;
}

function validateFile(obj) {
  if (!hasKeys(obj, KEYS.file)) {
    return false;
  }

  if (obj.categories.length == undefined || obj.entries.length == undefined) {
    return false;
  }

  return true;
}

function validateCategory(obj) {
  if (!hasKeys(obj, KEYS.category)) {
    return false;
  }

  return true;
}

function validateEntry(obj) {
  if (!hasKeys(obj, KEYS.entry)) {
    return false;
  }

  return true;
}

const KEYS = {
  file: ['categories', 'entries'],
  category: ['id', 'title', 'type'],
  entry: ['id', 'title', 'description', 'amount', 'date', 'category'],
};

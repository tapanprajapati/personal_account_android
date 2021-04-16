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
  //   console.log(categories);
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
  //   console.log(entries);
};

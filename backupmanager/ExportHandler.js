import RNFS from 'react-native-fs';
import CategoryDBHandler from '../databasehandler/categoryhandler';
import EntryDBHandler from '../databasehandler/entryhandler';

export function ExportHandler() {
  this.entryHandler = new EntryDBHandler();
  this.categoryHandler = new CategoryDBHandler();
}

ExportHandler.prototype.export = async function () {
  const fileName = RNFS.DownloadDirectoryPath + '/personalaccountbackup.json';

  let exportObject = {};

  const entries = await this.entryHandler.getAllEntries();
  const categories = await this.categoryHandler.getAllCategories();

  exportObject.categories = categories;
  exportObject.entries = entries;

  // console.log(exportObject);
  return RNFS.writeFile(fileName, JSON.stringify(exportObject));
};

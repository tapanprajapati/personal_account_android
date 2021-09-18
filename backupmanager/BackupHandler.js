import {ExportHandler} from './ExportHandler';
import {ImportHandler} from './ImportHandler';

export default function BackupHandler() {
  this.importHandler = new ImportHandler();
  // this.importHandler = new ImportHandler(file)
  this.exportHandler = new ExportHandler();
}

BackupHandler.prototype.importData = function (file) {
  console.log(file);
  this.importHandler.saveData(file);
};

BackupHandler.prototype.exportData = function () {
  return this.exportHandler.export();
};

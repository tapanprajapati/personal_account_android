import {ImportHandler} from './ImportHandler';

export default function BackupHandler() {
  this.importHandler = new ImportHandler();
  // this.importHandler = new ImportHandler(file)
}

BackupHandler.prototype.importData = function (file) {
  this.importHandler.saveData(file);
};

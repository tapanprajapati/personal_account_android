import RNFS from 'react-native-fs';

export default class CameraImageHandler {
  imageDirectoryPath =
    RNFS.ExternalStorageDirectoryPath + '/PersonalAccount/Images';

  async saveImage(id, imagePath) {
    const dirExists = await this.imageDirectoryExists();

    if (!dirExists) {
      console.log('Image directory does not exist');
      await this.createImageDirectory();
    }

    RNFS.copyFile(imagePath, `${this.imageDirectoryPath}/${id}.jpg`);
  }

  async imageDirectoryExists() {
    return RNFS.exists(this.imageDirectoryPath);
  }

  async imageExists(id) {
    return RNFS.exists(`${this.imageDirectoryPath}/${id}.jpg`);
  }

  async createImageDirectory() {
    console.log('Creating image directory');
    await RNFS.mkdir(this.imageDirectoryPath);
  }

  async deleteImage(id) {
    const exists = this.imageExists(id);

    if (exists) {
      await RNFS.unlink(`${this.imageDirectoryPath}/${id}.jpg`);
    }
  }

  async updateImage(id, imagePath) {
    const dirExists = await this.imageDirectoryExists();

    if (!dirExists) {
      console.log('Image directory does not exist');
      await this.createImageDirectory();
    }

    this.deleteImage(id);
    RNFS.copyFile(imagePath, `${this.imageDirectoryPath}/${id}.jpg`);
  }

  getImagePath(id) {
    return `file://${this.imageDirectoryPath}/${id}.jpg`;
  }
}

import API from "../utils/api";
import RNFS from "react-native-fs"

export default class CameraImageHandler {

  constructor() {
    if(CameraImageHandler._instance)
    {
      return CameraImageHandler._instance;
    }

    CameraImageHandler._instance = this;

    this.api = new API()
    return CameraImageHandler._instance;
  }

  getImageURL(id) {
      return this.api.entry.getImage()+id;
  }

  async saveImage(id, imagePath) {
    // const dirExists = await this.imageDirectoryExists();

    // if (!dirExists) {
    //   console.log('Image directory does not exist');
    //   await this.createImageDirectory();
    // }

    return new Promise((resolve,reject)=>{
      // RNFS.copyFile(imagePath, `${this.imageDirectoryPath}/${id}.jpg`);
      // RNFS.readFile(imagePath,"base64").then(image=>{
        let formData = new FormData();
        formData.append("name",id);
        formData.append("image",{uri: imagePath, name: `${id}.jpg`, type: 'image/jpg'})
  
        console.log(formData)
        fetch(this.api.entry.saveImage(),{
          method: 'POST',
          headers: {
            Accept: '*/*',
            'Content-Type': 'multipart/form-data'
          },
          body:formData
        })
        .then((response)=>response.json())
        .then(json=>{
          resolve(json)
        })
        .catch(error=>
          reject(error))
      });
    // })
  }

  async imageExists(id) {
    return new Promise((resolve, reject) => {
      console.log('Check if image exists for ID '+id);
      fetch(`${this.api.entry.checkImageExists()}${id}`)
      .then((response)=>response.json())
      .then(json=>{
        resolve(json)
      })
      .catch(error=>
        reject(error))
    });
  }

  async deleteImage(id) {
    return new Promise((resolve, reject) => {
    console.log('Delete image '+id);
    fetch(`${this.api.entry.deleteImage()}${id}`,{
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

  async updateImage(id, imagePath) {
    const dirExists = await this.imageDirectoryExists();

    if (!dirExists) {
      console.log('Image directory does not exist');
      await this.createImageDirectory();
    }

    this.deleteImage(id);
    RNFS.copyFile(imagePath, `${this.imageDirectoryPath}/${id}.jpg`);
  }
}

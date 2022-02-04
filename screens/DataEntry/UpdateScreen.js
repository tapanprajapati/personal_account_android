import React, {Component} from 'react';
import {ToastAndroid} from 'react-native';
import {View} from 'react-native';
import CameraImageHandler from '../../databasehandler/cameraImageHandler';
import EntryDBHandler from '../../databasehandler/entryhandler';
import {global} from '../../styles/global';
import EntryForm from './EntryForm';

export default class UpdateEntry extends Component {
  constructor(props) {
    super(props);
    this.entryHandler = new EntryDBHandler();
    this.entry = props.route.params.entry;
    this.cameraImageHandler = new CameraImageHandler();
  }

  updateEntry = (entry, imagePath) => {
    console.log('Updating data');
    this.entryHandler.updateEntry(entry).then((result) => {
      console.log(result);
      if (result.success) {
        console.log('Entry Updated');
        ToastAndroid.show('Entry Updated', ToastAndroid.SHORT);
        if (imagePath != '') {
          this.cameraImageHandler.saveImage(entry.id, imagePath).then(result=>{
            console.log(result)
          });;
        } else {
          this.cameraImageHandler.deleteImage(entry.id).then(result=>{
            console.log(result)
          });
        }
        this.props.navigation.goBack();
      } else {
        console.log(result.result);
      }
    });
  };
  render() {
    return (
      <View style={global.container}>
        <EntryForm
          handleFormData={this.updateEntry}
          type={this.props.route.params.type}
          entry={this.entry}
        />
      </View>
    );
  }
}

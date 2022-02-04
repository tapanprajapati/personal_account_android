import React, {Component} from 'react';
import {ToastAndroid} from 'react-native';
import {StyleSheet, View} from 'react-native';
import CameraImageHandler from '../../databasehandler/cameraImageHandler';
import EntryDBHandler from '../../databasehandler/entryhandler';
import {global} from '../../styles/global';
import EntryForm from './EntryForm';

export default class AddEntry extends Component {
  constructor(props) {
    super(props);
    this.entryHandler = new EntryDBHandler();
    this.cameraImageHandler = new CameraImageHandler();
  }

  addEntry = (entry, imagePath) => {
    console.log('Adding data');
    this.entryHandler.addEntry(entry).then((result) => {
      console.log(JSON.stringify(result));
      if (result.success) {
        console.log('Entry Added');
        console.log(result)
        // this.props.navigation.goBack();
        // this.props.route.params.refresh();

        if (imagePath != '') {
          this.cameraImageHandler.saveImage(result.id, imagePath).then(result=>{
            console.log(result)
          });
        }
        ToastAndroid.show('Entry Added Successfully', ToastAndroid.SHORT);
      } else {
        ToastAndroid.show('Error creating entry', ToastAndroid.SHORT);
      }
    });
  };
  render() {
    return (
      <View style={[global.container, styles.center]}>
        <EntryForm
          handleFormData={this.addEntry}
          type={this.props.route.params.type}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  center: {
    justifyContent: 'space-around',
  },
});

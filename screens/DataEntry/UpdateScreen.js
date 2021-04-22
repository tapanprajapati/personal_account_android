import React, {Component} from 'react';
import {ToastAndroid} from 'react-native';
import {View} from 'react-native';
import EntryDBHandler from '../../databasehandler/entryhandler';
import {global} from '../../styles/global';
import EntryForm from './EntryForm';

export default class UpdateEntry extends Component {
  constructor(props) {
    super(props);
    this.entryHandler = new EntryDBHandler();
    this.entry = props.route.params.entry;
  }

  updateEntry = (entry) => {
    console.log('Updating data');
    this.entryHandler.updateEntry(entry).then((result) => {
      console.log(result);
      if (result.success) {
        console.log('Entry Updated');
        ToastAndroid.show('Entry Updated', ToastAndroid.SHORT);
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

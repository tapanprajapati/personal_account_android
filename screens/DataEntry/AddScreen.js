import React, {Component} from 'react';
import {StyleSheet, View} from 'react-native';
import EntryDBHandler from '../../databasehandler/entryhandler';
import {global} from '../../styles/global';
import EntryForm from './EntryForm';

export default class AddEntry extends Component {
  constructor(props) {
    super(props);
    this.entryHandler = new EntryDBHandler();
  }

  addEntry = (entry) => {
    console.log('Adding data');
    this.entryHandler.addEntry(entry).then((result) => {
      console.log(result);
      if (result.success) {
        console.log('Entry Added');
        // this.props.navigation.goBack();
        // this.props.route.params.refresh();
      } else {
        console.log(result.result);
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

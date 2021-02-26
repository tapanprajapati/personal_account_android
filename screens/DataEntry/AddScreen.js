import React, {Component} from 'react';
import {View} from 'react-native';
import {global} from '../../styles/global';
import EntryForm from './EntryForm';

export default class AddEntry extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={global.container}>
        <EntryForm />
      </View>
    );
  }
}

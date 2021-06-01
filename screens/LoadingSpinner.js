import React, {Component} from 'react';
import {View} from 'react-native';
import {Modal} from 'react-native';
import {BackHandler} from 'react-native';
import {ActivityIndicator} from 'react-native';

export default class LoadingSpinner extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Modal
        transparent={true}
        visible={this.props.isLoading}
        onRequestClose={BackHandler.exitApp}>
        <View style={{height: '100%', width: '100%'}}>
          <ActivityIndicator
            color="#01A4EF"
            animating={this.props.isLoading}
            size={50}
            style={{position: 'absolute', top: '50%', alignSelf: 'center'}}
          />
        </View>
      </Modal>
    );
  }
}

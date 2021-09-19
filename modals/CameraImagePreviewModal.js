import React, {Component} from 'react';
import {Dimensions} from 'react-native';
import {StyleSheet} from 'react-native';
import {Modal, View, Text} from 'react-native';
import {Image} from 'react-native-elements';
export default class CameraImagePreviewModal extends Component {
  constructor(props) {
    super(props);
    // console.log(props.uri);
  }

  render() {
    return (
      <Modal
        visible={this.props.visible}
        transparent={true}
        onRequestClose={this.props.close}>
        <View style={styles.container}>
          <Image
            source={{uri: this.props.uri}}
            style={{height: '100%', width: '100%', borderRadius: 15}}
          />
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 15,
  },
});

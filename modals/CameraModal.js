import React, {Component} from 'react';
import {Dimensions} from 'react-native';
import {StyleSheet} from 'react-native';
import {Modal, View, Text} from 'react-native';
import {RNCamera} from 'react-native-camera';
export default class CameraModal extends Component {
  constructor(props) {
    super(props);
  }

  takePicture = () => {
    let options = {
      quality: 0.85,
      fixOrientation: true,
      forceUpOrientation: true,
    };
    this.camera.takePictureAsync(options).then((data) => {
      console.log(data);
      this.props.captureImage(data.uri);
      this.props.close();
    });
  };
  render() {
    return (
      <Modal
        visible={this.props.visible}
        transparent={true}
        onRequestClose={this.props.close}>
        <View style={styles.container}>
          <RNCamera
            ref={(ref) => {
              this.camera = ref;
            }}
            style={styles.preview}
            type={RNCamera.Constants.Type.back}
            androidCameraPermissionOptions={{
              title: 'Permission to use camera',
              message: 'We need your permission to use your camera',
              buttonPositive: 'Ok',
              buttonNegative: 'Cancel',
            }}>
            <Text style={styles.capture} onPress={this.takePicture.bind(this)}>
              [CAPTURE]
            </Text>
          </RNCamera>
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width,
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    color: '#000',
    padding: 10,
    margin: 40,
  },
});

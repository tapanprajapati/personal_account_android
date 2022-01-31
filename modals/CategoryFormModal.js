import React, {Component} from 'react';
import {Alert, StyleSheet, Text, TextInput, View} from 'react-native';
import {Button} from 'react-native-elements';
import {ButtonColors} from '../styles/colors';
import {dimensions} from '../utils/constants';

export default class CategoryForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categoryTitle: '',
    };
  }

  addCategory = () => {
    const input = this.state.categoryTitle;

    if (input == '') {
      Alert.alert('ERROR', 'Please Enter Category Name', [
        {
          text: 'Close',
        },
      ]);
    } else {
      // this.props.checkCategory(input).then((result) => {
        // if (result) {
        //   Alert.alert('ERROR', 'Category Exists', [
        //     {
        //       text: 'Close',
        //     },
        //   ]);
        // } else {
          this.props.submitData(input);
          this.props.closeModal();
        // }
      // });
    }
  };

  render() {
    return (
      <View style={styles.modalContainer}>
        <View style={styles.inputHolder}>
          <Text style={styles.inputText}>{this.props.title}</Text>
          <TextInput
            onChangeText={(text) => this.setState({categoryTitle: text})}
            style={[styles.inputElement, styles.textInput]}></TextInput>
        </View>
        <View style={styles.inputHolder}>
          <Button
            buttonStyle={styles.button}
            title={this.props.buttonTitle}
            color={ButtonColors.entryAdd}
            titleStyle={{fontSize: dimensions.categoryModal.buttonFont}}
            onPress={this.addCategory}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  modalContainer: {
    margin: 20,
    padding: 10,
    backgroundColor: '#fff',
    elevation: 10,
    borderRadius: 3,
    shadowColor: 'grey',
    width: '100%',
  },
  inputText: {
    marginBottom: dimensions.categoryModal.textMargin,
    fontSize: dimensions.categoryModal.titleText,
    alignSelf: 'center',
  },
  inputElement: {},
  inputHolder: {
    flexDirection: 'column',
    marginBottom: dimensions.categoryModal.buttonMargin,
  },

  textInput: {
    borderWidth: 1,
    paddingVertical: 5,
    paddingHorizontal: dimensions.entryForm.input.inputPaddingHorizontal,
    borderColor: '#ccd',
    borderRadius: 4,
    fontSize: dimensions.entryForm.input.text,
  },
  button: {
    height: 40,
    backgroundColor: ButtonColors.entryAdd,
    fontSize: dimensions.entryForm.input.buttonFont,
  },
});

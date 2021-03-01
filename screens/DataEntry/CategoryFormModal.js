import React, {Component} from 'react';
import {Alert, Button, StyleSheet, Text, TextInput, View} from 'react-native';
import {ButtonColors} from '../../styles/colors';

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
      this.props.checkCategory(input).then((result) => {
        if (result) {
          Alert.alert('ERROR', 'Category Exists', [
            {
              text: 'Close',
            },
          ]);
        } else {
          this.props.addCategory(input);
          this.props.closeModal();
        }
      });
    }
  };

  render() {
    return (
      <View style={styles.modalContainer}>
        <View style={styles.inputHolder}>
          <Text style={styles.inputText}>Title</Text>
          <TextInput
            onChangeText={(text) => this.setState({categoryTitle: text})}
            style={[styles.inputElement, styles.textInput]}></TextInput>
        </View>
        <View style={styles.inputHolder}>
          <Button
            containerStyle={{
              marginTop: 10,
            }}
            buttonStyle={styles.button}
            title="ADD"
            color={ButtonColors.entryAdd}
            titleStyle={{fontSize: 14}}
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
    marginBottom: 5,
  },
  inputElement: {},
  inputHolder: {
    flexDirection: 'column',
    marginBottom: 5,
  },

  textInput: {
    borderWidth: 1,
    paddingVertical: 0,
    borderColor: '#ccd',
    borderRadius: 4,
  },
  button: {
    height: 30,
    backgroundColor: ButtonColors.entryAdd,
    fontSize: 14,
  },
});

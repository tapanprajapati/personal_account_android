import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import {Button} from 'react-native-elements';
import {ButtonColors} from '../../styles/colors';

export default class EntryForm extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <ScrollView>
        <View style={styles.container}>
          <View style={styles.inputHolder}>
            <Text style={styles.inputText}>Title</Text>
            <TextInput
              style={[styles.inputElement, styles.textInput]}></TextInput>
          </View>

          <View style={styles.inputHolder}>
            <Text style={styles.inputText}>Description</Text>
            <TextInput
              style={[styles.inputElement, styles.textInput]}
              multiline={true}></TextInput>
          </View>

          <View style={styles.inputHolder}>
            <Text style={styles.inputText}>Amount</Text>
            <TextInput
              style={[styles.inputElement, styles.textInput]}
              keyboardType="numeric"></TextInput>
          </View>
          <View style={styles.inputHolder}>
            <Text style={styles.inputText}>Date</Text>
            <TextInput
              style={[styles.inputElement, styles.textInput]}
              editable={false}></TextInput>
          </View>
          <View style={styles.inputHolder}>
            <Text style={styles.inputText}>Type</Text>
            <DropDownPicker
              items={[
                {
                  label: 'Income',
                  value: 'Income',
                },
                {
                  label: 'Expense',
                  value: 'Expense',
                },
              ]}
              containerStyle={[styles.inputElement, styles.dropDown]}
            />
          </View>
          <View style={styles.inputHolder}>
            <Text style={styles.inputText}>Category</Text>
            <DropDownPicker
              items={[
                {
                  label: 'Shopping',
                  value: 'Shopping',
                },
                {
                  label: 'Rent',
                  value: 'Rent',
                },
              ]}
              containerStyle={[styles.inputElement, styles.dropDown]}
            />
          </View>

          <View style={styles.inputHolder}>
            <Button
              containerStyle={{
                marginTop: 10,
              }}
              buttonStyle={styles.button}
              title="ADD"
              color={ButtonColors.entryAdd}
              raised
              titleStyle={{fontSize: 14}}
            />
          </View>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    // height: '100%',
    marginHorizontal: 40,
    // justifyContent: 'space-around',
  },
  inputHolder: {
    flexDirection: 'column',
    marginBottom: 5,
  },
  inputText: {
    fontSize: 14,
    color: 'grey',
    marginBottom: 3,
  },
  inputElement: {},
  dropDown: {
    height: 30,
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

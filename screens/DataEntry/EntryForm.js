import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  ScrollView,
  TouchableOpacity,
  Modal,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {Button, Icon} from 'react-native-elements';
import {ButtonColors} from '../../styles/colors';
import DateTimePicker from '@react-native-community/datetimepicker';
import CategoryForm from './CategoryFormModal';
import EntryDBHandler from '../../databasehandler/entryhandler';
import CategoryDBHandler from '../../databasehandler/categoryhandler';

export default class EntryForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showDatePicker: false,
      date: new Date(),
      showCategoryModal: false,
      selectedType: this.props.type.toLowerCase(),
      selectedCategoryId: 0,
      categories: [],
    };

    this.entryHandler = new EntryDBHandler();
    this.categoryHandler = new CategoryDBHandler();
  }

  setType = (type) => {
    this.setState({
      selectedType: type,
    });
  };

  setCategory = (id) => {
    this.setState({
      selectedCategoryId: id,
    });
  };

  getCategories = () => {
    this.categoryHandler
      .getCategories(this.state.selectedType)
      .then((result) => {
        console.log(result);
        this.setState({
          categories: result,
        });
      });
  };

  setEntryDate = (event, selectedDate) => {
    this.setState({
      date: selectedDate || this.state.date,
      showDatePicker: false,
    });
  };

  closeCategoryModal = () => {
    this.setState({
      showCategoryModal: false,
    });
  };

  checkCategory = (category) => {
    console.log('Check category called');
    return this.categoryHandler.categoryExists(
      category,
      this.state.selectedType,
    );
  };

  addCategory = (category) => {
    this.categoryHandler
      .addCategory({title: category, type: this.state.selectedType})
      .then((result) => {
        if (result.success) {
          console.log('Category Added');
        }
        this.getCategories();
      });
  };

  componentDidMount() {
    this.getCategories();
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
            <TouchableOpacity
              onPress={() =>
                this.setState({
                  showDatePicker: true,
                })
              }>
              <TextInput
                style={[styles.inputElement, styles.textInput]}
                editable={false}
                value={this.state.date.toISOString().slice(0, 10)}></TextInput>
            </TouchableOpacity>
          </View>
          <View style={styles.inputHolder}>
            <Text style={styles.inputText}>Type</Text>
            <Picker
              style={[styles.inputElement, styles.dropDown]}
              mode="dropdown"
              selectedValue={this.props.type.toLowerCase()}>
              <Picker.Item label="Income" value="income" />
              <Picker.Item label="Expense" value="expense" />
            </Picker>
          </View>
          <View style={styles.inputHolder}>
            <Text style={styles.inputText}>Category</Text>
            <View style={styles.horizontalInputContainer}>
              <Picker
                onValueChange={(value, index) => {
                  this.setState({selectedCategoryId: value});
                }}
                style={([styles.inputElement, styles.dropDown], {flex: 7})}
                mode="dropdown">
                {this.state.categories.map((item) => {
                  return (
                    <Picker.Item
                      key={item.id}
                      label={item.title}
                      value={item.id}
                    />
                  );
                })}
              </Picker>
              <Icon
                name="add"
                type="material"
                reverse
                containerStyle={{flex: 1}}
                color={ButtonColors.homeButton.floating}
                size={12}
                onPress={() => this.setState({showCategoryModal: true})}
              />
            </View>
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
            />
          </View>
        </View>

        <Modal
          visible={this.state.showCategoryModal}
          transparent={true}
          animationType="slide"
          onRequestClose={this.closeCategoryModal}>
          <View style={styles.categoryModal}>
            <CategoryForm
              checkCategory={this.checkCategory}
              addCategory={this.addCategory}
              closeModal={this.closeCategoryModal}
            />
          </View>
        </Modal>
        {this.state.showDatePicker && (
          <DateTimePicker
            mode="date"
            value={this.state.date}
            display="calendar"
            onChange={this.setEntryDate}
          />
        )}
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
  horizontalInputContainer: {
    flexDirection: 'row',
  },
  categoryModal: {
    padding: 20,
    justifyContent: 'center',
    flex: 1,
    alignItems: 'center',
  },
});

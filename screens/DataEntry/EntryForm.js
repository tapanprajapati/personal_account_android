import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Modal,
  Alert,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {Button, Icon, Image} from 'react-native-elements';
import {ButtonColors, TextColors} from '../../styles/colors';
import DateTimePicker from '@react-native-community/datetimepicker';
import EntryDBHandler from '../../databasehandler/entryhandler';
import CategoryDBHandler from '../../databasehandler/categoryhandler';
import {dimensions} from '../../utils/constants';
import {ToastAndroid} from 'react-native';
import CategoryForm from '../../modals/CategoryFormModal';
import CameraModal from '../../modals/CameraModal';
import CameraImagePreviewModal from '../../modals/CameraImagePreviewModal';
import CameraImageHandler from '../../databasehandler/cameraImageHandler';

export default class EntryForm extends Component {
  constructor(props) {
    super(props);

    this.cameraImageHandler = new CameraImageHandler();

    if (!props.entry) {
      // console.log('In');
      this.state = {
        showDatePicker: false,
        showCameraModal: false,
        showPreview: false,
        date: new Date(),
        showCategoryModal: false,
        selectedType: this.props.type.toLowerCase(),
        selectedCategoryId: 0,
        title: '',
        amount: '',
        description: '',
        categories: [],
        imagePath: '',
      };
    } else {
      this.state = {
        showDatePicker: false,
        date: new Date(props.entry.date),
        showCameraModal: false,
        showPreview: false,
        showCategoryModal: false,
        selectedType: props.entry.category.type,
        selectedCategoryId: props.entry.category.id,
        title: props.entry.title,
        amount: props.entry.amount.toString(),
        description: props.entry.description,
        categories: [],
        imagePath: '',
      };

      this.cameraImageHandler.imageExists(props.entry.id).then((result) => {
        if (result) {
          this.setState({
            imagePath: this.cameraImageHandler.getImagePath(props.entry.id),
          });
        }
      });
    }

    this.buttonText = 'ADD';

    if (props.entry) {
      this.buttonText = 'UPDATE';
    }
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

  getCategories = (type) => {
    this.categoryHandler.getCategories(type).then((result) => {
      // console.log(result);
      this.setState({
        categories: result,
      });

      if (this.state.selectedType!=type) {
        this.setState({
          selectedCategoryId: result[0].id,
        });
      }

      this.setState({selectedType: type})
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
          this.getCategories(this.state.selectedType);
          ToastAndroid.show('Category Added Successfully', ToastAndroid.SHORT);
        } else {
          ToastAndroid.show('Error Adding Category', ToastAndroid.SHORT);
        }
      });
  };

  getImagePath = (path) => {
    this.setState({
      imagePath: path,
    });
  };

  submitForm = () => {
    let title = this.state.title;
    let description = this.state.description;
    let amount = this.state.amount;
    let date = this.state.date.toISOString().slice(0, 10);
    let categoryId = this.state.selectedCategoryId;

    let error = false;
    let errorMessage = 'Correct Following';

    if (title == '') {
      error = true;
      errorMessage += '\nEnter Valid Title';
    }

    if (amount == '') {
      error = true;
      errorMessage += '\nEnter Valid Amount';
    }

    if (categoryId == 0) {
      error = true;
      errorMessage += '\nEnter Valid Category';
    }

    if (error) {
      Alert.alert('ERROR', errorMessage, [
        {
          text: 'Close',
        },
      ]);
    } else {
      let entry = {
        title: title,
        description: description,
        amount: amount,
        date: date,
        category: {id: categoryId},
      };

      if (this.props.entry) {
        entry.id = this.props.entry.id;
      }

      console.log(entry);

      this.props.handleFormData(entry, this.state.imagePath);
      this.resetInputs();
    }
  };

  resetInputs() {
    this.setState({
      title: '',
      amount: '',
      description: '',
      imagePath: '',
    });
  }

  componentDidMount() {
    this.getCategories(this.state.selectedType);
  }

  render() {
    return (
      <ScrollView>
        <View style={styles.container}>
          <View style={styles.inputHolder}>
            <Text style={styles.inputText}>Title*</Text>
            <TextInput
              value={this.state.title}
              style={[styles.inputElement, styles.textInput]}
              onChangeText={(text) => this.setState({title: text})}></TextInput>
          </View>

          <View style={styles.inputHolder}>
            <Text style={styles.inputText}>Description</Text>
            <TextInput
              value={this.state.description}
              style={[styles.inputElement, styles.textInput]}
              multiline={true}
              onChangeText={(text) =>
                this.setState({description: text})
              }></TextInput>
          </View>

          <View style={styles.inputHolder}>
            <Text style={styles.inputText}>Amount*</Text>
            <TextInput
              value={this.state.amount}
              style={[styles.inputElement, styles.textInput]}
              keyboardType="numeric"
              onChangeText={(text) =>
                this.setState({amount: text})
              }></TextInput>
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
              itemStyle={{fontSize: dimensions.entryForm.input.text}}
              onValueChange={(value, index) => {
                this.getCategories(value);
              }}
              selectedValue={this.state.selectedType}>
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
                selectedValue={this.state.selectedCategoryId}
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
            <Text style={styles.inputText}>Add Image</Text>
            <View style={styles.horizontalInputContainer}>
              <Icon
                name="add-a-photo"
                type="material"
                reverse
                containerStyle={{flex: 1}}
                color={ButtonColors.homeButton.floating}
                size={15}
                onPress={() => this.setState({showCameraModal: true})}
              />
              {this.state.imagePath != '' && (
                <Icon
                  name="check"
                  type="material"
                  reverse
                  containerStyle={{flex: 1}}
                  color={TextColors.income}
                  size={15}
                  onPress={() => {
                    console.log('Showing Preview');
                    this.setState({showPreview: true});
                  }}
                />
              )}
              {this.state.imagePath != '' && (
                <Icon
                  name="clear"
                  type="material"
                  reverse
                  containerStyle={{flex: 1}}
                  color={TextColors.expense}
                  size={15}
                  onPress={() => {
                    this.setState({imagePath: ''});
                  }}
                />
              )}
            </View>
          </View>

          <View style={styles.inputHolder}>
            <Button
              containerStyle={{
                marginTop: 10,
              }}
              buttonStyle={styles.button}
              title={this.buttonText}
              color={ButtonColors.entryAdd}
              titleStyle={{fontSize: dimensions.entryForm.input.buttonFont}}
              onPress={this.submitForm}
            />
          </View>

          <Modal
            visible={this.state.showCategoryModal}
            transparent={true}
            animationType="slide"
            onRequestClose={this.closeCategoryModal}>
            <View style={styles.categoryModal}>
              <CategoryForm
                title="Add New Category"
                checkCategory={this.checkCategory}
                submitData={this.addCategory}
                closeModal={this.closeCategoryModal}
                buttonTitle="Add"
              />
            </View>
          </Modal>
          <CameraModal
            captureImage={this.getImagePath}
            visible={this.state.showCameraModal}
            close={() => {
              this.setState({showCameraModal: false});
            }}
          />

          <CameraImagePreviewModal
            visible={this.state.showPreview}
            close={() => {
              this.setState({showPreview: false});
            }}
            uri={this.state.imagePath}
          />

          {this.state.showDatePicker && (
            <DateTimePicker
              mode="date"
              value={this.state.date}
              display="calendar"
              onChange={this.setEntryDate}
            />
          )}
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    // height: '100%',
    marginHorizontal: 40,
    marginTop: 15,
    // justifyContent: 'space-around',
  },
  inputHolder: {
    flexDirection: 'column',
    marginBottom: dimensions.entryForm.input.margin,
  },
  inputText: {
    fontSize: dimensions.entryForm.input.text,
    color: 'grey',
    marginBottom: dimensions.entryForm.input.textMargin,
  },
  inputElement: {},
  dropDown: {
    height: dimensions.entryForm.input.dropdownHeight,
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
    height: dimensions.entryForm.input.buttonHeight,
    backgroundColor: ButtonColors.entryAdd,
    fontSize: dimensions.entryForm.input.buttonFont,
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

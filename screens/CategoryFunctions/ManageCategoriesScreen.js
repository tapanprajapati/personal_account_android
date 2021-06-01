import {Picker} from '@react-native-picker/picker';
import React, {Component} from 'react';
import {StyleSheet} from 'react-native';
import {FlatList} from 'react-native';
import {Modal} from 'react-native';
import {ToastAndroid} from 'react-native';
import {Text} from 'react-native';
import {View} from 'react-native';
import {Icon} from 'react-native-elements';
import CategoryDBHandler from '../../databasehandler/categoryhandler';
import {ButtonColors} from '../../styles/colors';
import {global} from '../../styles/global';
import {dimensions} from '../../utils/constants';
import CategoryForm from '../DataEntry/CategoryFormModal';
import Category from './CategoryComponent';

export default class ManageCategoriesScreen extends Component {
  constructor(props) {
    super(props);
    this.categoryHandler = new CategoryDBHandler();
    this.state = {
      selected: 'expense',
      categories: [],
      showUpdateModal: false,
      showAddModal: false,
      selectedCategory: '',
    };
  }

  getCategories = (type = this.state.selected) => {
    this.categoryHandler.getCategories(type).then((categories) => {
      this.setState({
        categories: categories,
      });
    });
  };

  handleEdit = (category) => {
    this.setState({
      selectedCategory: category,
      showUpdateModal: true,
    });
  };

  checkCategory = (title) => {
    return this.categoryHandler.categoryExists(title, this.state.selected);
  };

  addCategory = (category) => {
    this.categoryHandler
      .addCategory({title: category, type: this.state.selected})
      .then((result) => {
        if (result.success) {
          this.getCategories();
          ToastAndroid.show('Category Added Successfully', ToastAndroid.SHORT);
        } else {
          ToastAndroid.show('Error Adding Category', ToastAndroid.SHORT);
        }
      });
  };

  updateCategory = (title) => {
    this.categoryHandler
      .updateCategory(title, this.state.selectedCategory.id)
      .then((result) => {
        if (result == true) {
          ToastAndroid.show(
            `${this.state.selectedCategory.title} updated successfully`,
            ToastAndroid.SHORT,
          );
          this.getCategories();
        } else {
          ToastAndroid.show('Error Updating Category', ToastAndroid.SHORT);
        }
      });
  };

  componentDidMount() {
    this.getCategories();
  }

  render() {
    return (
      <View style={global.container}>
        <View style={styles.inputHolder}>
          <Text style={styles.inputText}>Select Category Type</Text>
          <View style={styles.horizontalContainer}>
            <Picker
              style={[styles.inputElement, styles.dropDown]}
              mode="dropdown"
              itemStyle={{fontSize: dimensions.entryForm.input.text}}
              onValueChange={(value, index) => {
                this.setState({selected: value});
                this.getCategories(value);
              }}
              selectedValue={this.state.selected}>
              <Picker.Item label="Income" value="income" />
              <Picker.Item label="Expense" value="expense" />
            </Picker>
            <Icon
              name="add"
              type="material"
              reverse
              containerStyle={{flex: 1}}
              color={ButtonColors.homeButton.floating}
              size={12}
              onPress={() => this.setState({showAddModal: true})}
            />
          </View>
        </View>

        <FlatList
          style={styles.categoryList}
          data={this.state.categories}
          keyExtractor={(item) => item.id}
          renderItem={({item}) => {
            return <Category handleEdit={this.handleEdit} data={item} />;
          }}
        />

        {/* EDIT CATEGORY TITLE */}

        <Modal
          visible={this.state.showUpdateModal}
          transparent={true}
          animationType="slide"
          onRequestClose={() => {
            this.setState({
              showUpdateModal: false,
            });
          }}>
          <View style={styles.categoryModal}>
            <CategoryForm
              title={`Update Category: ${this.state.selectedCategory.title}`}
              checkCategory={this.checkCategory}
              submitData={this.updateCategory}
              closeModal={() => {
                this.setState({
                  showUpdateModal: false,
                });
              }}
              buttonTitle="Update"
            />
          </View>
        </Modal>
        <Modal
          visible={this.state.showAddModal}
          transparent={true}
          animationType="slide"
          onRequestClose={() => {
            this.setState({
              showAddModal: false,
            });
          }}>
          <View style={styles.categoryModal}>
            <CategoryForm
              title={`Add Category of Type: ${this.state.selected.toUpperCase()}`}
              checkCategory={this.checkCategory}
              submitData={this.addCategory}
              closeModal={() => {
                this.setState({
                  showAddModal: false,
                });
              }}
              buttonTitle="Add"
            />
          </View>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  inputHolder: {
    // flexDirection: 'row',
    marginBottom: dimensions.entryForm.input.margin,
    marginHorizontal: 50,
    marginTop: 30,
  },
  horizontalContainer: {
    flexDirection: 'row',
    marginHorizontal: 30,
  },
  inputText: {
    fontSize: dimensions.entryForm.input.text,
    color: 'steelblue',
    fontWeight: 'bold',
    alignSelf: 'center',
    marginBottom: dimensions.entryForm.input.textMargin,
  },
  inputElement: {},
  dropDown: {
    height: dimensions.entryForm.input.dropdownHeight,
    marginHorizontal: 4,
    flex: 4,
  },
  categoryList: {
    marginHorizontal: 60,
  },
  categoryModal: {
    padding: 20,
    justifyContent: 'center',
    flex: 1,
    alignItems: 'center',
  },
});

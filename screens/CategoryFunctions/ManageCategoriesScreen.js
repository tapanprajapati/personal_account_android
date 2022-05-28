import {Picker} from '@react-native-picker/picker';
import React, {Component} from 'react';
import {Alert, StyleSheet} from 'react-native';
import {FlatList} from 'react-native';
import {Modal} from 'react-native';
import {ToastAndroid} from 'react-native';
import {Text} from 'react-native';
import {View} from 'react-native';
import {Icon} from 'react-native-elements';
import Category from '../../components/CategoryComponent';
import CategoryDBHandler from '../../databasehandler/categoryhandler';
import CategoryForm from '../../modals/CategoryFormModal';
import CategoryTransfer from '../../modals/CategoryTransferModal';
import {ButtonColors} from '../../styles/colors';
import {global} from '../../styles/global';
import {dimensions} from '../../utils/constants';

export default class ManageCategoriesScreen extends Component {
  constructor(props) {
    super(props);
    this.categoryHandler = new CategoryDBHandler();
    this.state = {
      selected: 'expense',
      categories: [],
      showUpdateModal: false,
      showAddModal: false,
      showTransferModal: false,
      selectedCategory: '',
    };
  }

  getCategories = (type = this.state.selected) => {
    this.categoryHandler.getCategories(type).then((result) => {
      if(result.success)
      {
        const categories = result.message
        this.setState({
          categories: categories,
        });
      }
      else
      {
        Alert.alert('ERROR', `${result.message.toUpperCase()}`, [
            {
              text: 'Close',  
            },
          ]);
      }
    });
  };

  handleEdit = (category) => {
    this.setState({
      selectedCategory: category,
      showUpdateModal: true,
    });
  };

  handleTransfer = (category) => {
    this.setState({
      selectedCategory: category,
      showTransferModal: true,
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

  updateCategory = (title, allowance) => {
    this.categoryHandler
      .updateCategory(title,  allowance, this.state.selectedCategory.id,this.state.selected)
      .then((result) => {
        if (result.success) {
          ToastAndroid.show(
            `${this.state.selectedCategory.title} updated successfully`,
            ToastAndroid.LONG,
          );
          this.getCategories();
        } 
        else if(result.statusCode==400){
          Alert.alert('ERROR', `${result.message.toUpperCase()}`, [
            {
              text: 'Close',  
            },
          ]);
        }else {
          ToastAndroid.show(`Error Updating Category`, ToastAndroid.LONG);
        }
      });
  };

  deleteCategory = (category) => {
    this.categoryHandler.deleteCategory(category.id).then((result) => {
      if (result.success == true) {
        ToastAndroid.show(
          `${category.title} deleted successfully`,
          ToastAndroid.LONG,
        );
        this.getCategories();
      } else {
        ToastAndroid.show('Error Deleting Category', ToastAndroid.LONG);
      }
    });
  };

  transferCategory = (id) => {
    this.categoryHandler
      .transferCategory(this.state.selectedCategory.id, id)
      .then((result) => {
        if (result.success == true) {
          ToastAndroid.show(
            `${result.message}`.toUpperCase(),
            ToastAndroid.LONG,
          );
          this.getCategories();
        } else {
          ToastAndroid.show('Error Transferring Category', ToastAndroid.LONG);
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
          keyExtractor={(item) => `${item.id}`}
          renderItem={({item}) => {
            return (
              <Category
                handleDelete={this.deleteCategory}
                handleEdit={this.handleEdit}
                handleTransfer={this.handleTransfer}
                data={item}
              />
            );
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
              allowance={this.state.selectedCategory.allowance}
              categoryTitle={this.state.selectedCategory.title}
            />
          </View>
        </Modal>

        {/* ADD NEW CATEGORY */}

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

        {/* TRANSFER CATEGORY DATA */}

        <Modal
          visible={this.state.showTransferModal}
          transparent={true}
          animationType="slide"
          onRequestClose={() => {
            this.setState({
              showTransferModal: false,
            });
          }}>
          <View style={styles.categoryModal}>
            <CategoryTransfer
              submitData={this.transferCategory}
              sourceCategory={this.state.selectedCategory}
              categories={this.state.categories}
              closeModal={() => {
                this.setState({
                  showTransferModal: false,
                });
              }}
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
    marginHorizontal: 30,
  },
  categoryModal: {
    padding: 20,
    justifyContent: 'center',
    flex: 1,
    alignItems: 'center',
  },
});

import { Picker } from '@react-native-picker/picker';
import React, {Component} from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';
import {Icon, Button, CheckBox} from 'react-native-elements';
import {dimensions} from '../utils/constants';

export default class CategoryFilterModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categories: this.props.categories,
      users: this.props.users,
      checkAll: true,
      selectedUser: this.props.selectedUser
    };
  }

  changeStatus = (item) => {
    let tempCategories = this.state.categories;
    for (let i = 0; i < tempCategories.length; i++) {
      if (tempCategories[i].category.id == item.category.id) {
        tempCategories[i].status = !item.status;
      }
    }

    this.setState({
      categories: tempCategories,
    });
  };

  saveChanges = () => {
    this.props.saveChanges(this.state.categories, this.state.selectedUser);

    this.props.close();
  };

  handleCheckedAll = () => {
    let tempCategories = [...this.state.categories];
    tempCategories.forEach((category) => {
      category.status = !this.state.checkAll;
    });
    this.setState({
      categories: tempCategories,
      checkAll: !this.state.checkAll,
    });
  };
  render() {
    return (
      <View style={styles.container}>
        <Icon
          onPress={() => this.props.close()}
          name="close"
          size={17}
          type="material"
          containerStyle={styles.closeIcon}
        />
        <Text style={styles.title}>Filter Category</Text>
        {
          this.props.users && (

            <Picker
              style={[styles.dropDown]}
              mode="dropdown"
              itemStyle={{fontSize: dimensions.entryForm.input.text}}
              onValueChange={(value, index) => {
                this.setState({selectedUser: value})
              }}
              selectedValue={this.state.selectedUser}>
              {
                this.state.users.map(user=>{
                  return(
                    <Picker.Item label={user.username} value={user.username} key={user.username} />
                  )
                })
              }
            </Picker>
          )
        }
        <CheckBox
          containerStyle={{margin: 0, padding: 5}}
          checked={this.state.checkAll}
          size={dimensions.categoryFilter.checkBox}
          onPress={this.handleCheckedAll}
        />
        <FlatList
          data={this.state.categories}
          keyExtractor={(item) => item.category.id.toString()}
          style={styles.list}
          renderItem={({item}) => {
            return (
              <CategorySelect
                category={item.category}
                status={item.status}
                handleChecked={() => this.changeStatus(item)}
              />
            );
          }}
        />
        <Button
          titleStyle={{fontSize: dimensions.categoryFilter.buttonText}}
          buttonStyle={styles.saveButton}
          title="SAVE"
          onPress={this.saveChanges}
        />
      </View>
    );
  }
}

class CategorySelect extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.categorySelectContainer}>
        <CheckBox
          containerStyle={{margin: 0, padding: 5}}
          checked={this.props.status}
          size={dimensions.categoryFilter.checkBox}
          onPress={this.props.handleChecked}
        />
        <Text style={styles.categorySelectText}>
          {this.props.category.title}
        </Text>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    margin: 20,
    padding: 5,
    backgroundColor: 'white',
    elevation: 3,
    borderRadius: 3,
  },
  title: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: dimensions.categoryFilter.headerText,
  },
  list: {},
  categorySelectContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  saveButton: {
    marginHorizontal: 15,
    marginVertical: 5,
    padding: 2,
  },
  closeIcon: {
    position: 'absolute',
    top: 4,
    right: 4,
    zIndex: 2,
  },
  categorySelectText: {
    fontSize: dimensions.categoryFilter.titleText,
  },
});

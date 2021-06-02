import {Picker} from '@react-native-picker/picker';
import React, {Component} from 'react';
import {Alert, StyleSheet, Text, TextInput, View} from 'react-native';
import {Button, Icon} from 'react-native-elements';
import {ButtonColors} from '../styles/colors';
import {dimensions} from '../utils/constants';

export default class CategoryTransfer extends Component {
  constructor(props) {
    super(props);
    let tID = this.props.categories[0].id;

    if (tID === this.props.sourceCategory.id) {
      tID = this.props.categories[1].id;
    }
    this.state = {
      targetCategory: tID,
    };
  }

  transferCategory = () => {
    let message = `All the data from "${
      this.props.sourceCategory.title
    }" will be transferred to "${this.getTitle()}"`;
    Alert.alert('WARNING', message, [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Transfer',
        onPress: () => {
          this.props.submitData(this.state.targetCategory);
          this.props.closeModal();
        },
      },
    ]);
  };

  getTitle = () => {
    return this.props.categories.find(
      (category) => category.id == this.state.targetCategory,
    ).title;
  };

  render() {
    return (
      <View style={styles.modalContainer}>
        <View style={styles.transferContainer}>
          <Text style={styles.source}>{this.props.sourceCategory.title}</Text>
          <Icon
            name="arrow-forward"
            type="material"
            color="steelblue"
            containerStyle={{flex: 0.5}}
            size={30}
          />
          <Picker
            style={[styles.inputElement, styles.dropDown]}
            mode="dropdown"
            itemStyle={{fontSize: dimensions.entryForm.input.text}}
            onValueChange={(value, index) => {
              this.setState({targetCategory: value});
              // this.getCategories(value);
            }}
            selectedValue={this.state.targetCategory}>
            {this.props.categories.map((category, index) => {
              if (category.id != this.props.sourceCategory.id) {
                return (
                  <Picker.Item
                    key={category.id}
                    label={category.title}
                    value={category.id}
                  />
                );
              }
            })}
          </Picker>
        </View>
        <View style={styles.inputHolder}>
          <Button
            buttonStyle={styles.button}
            title="Transfer"
            color={ButtonColors.entryAdd}
            titleStyle={{fontSize: dimensions.categoryModal.buttonFont}}
            onPress={this.transferCategory}
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
  transferContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginVertical: 20,
    marginHorizontal: 5,
  },
  source: {
    alignSelf: 'center',
    fontSize: dimensions.entryForm.input.text,
    textAlign: 'center',
    flex: 0.5,
  },
  dropDown: {
    height: dimensions.entryForm.input.dropdownHeight,
    flex: 1,
  },
  button: {
    height: 40,
    backgroundColor: ButtonColors.entryAdd,
    fontSize: dimensions.entryForm.input.buttonFont,
  },
});

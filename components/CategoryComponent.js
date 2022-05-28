import React, {Component} from 'react';
import {Text} from 'react-native';
import {StyleSheet} from 'react-native';
import {Alert} from 'react-native';
import {View} from 'react-native';
import {Icon} from 'react-native-elements';
import {ButtonColors} from '../styles/colors';
import {global} from '../styles/global';

export default class Category extends Component {
  constructor(props) {
    super(props);
    this.controlButtonSize = 20;
  }

  confirmAndDelete = () => {
    let message = `Do you want to delete category: ${this.props.data.title} ?\n\nNOTE: All the entries of this category will be deleted. Please transfer entries to another category before deleting.`;
    Alert.alert('WARNING', message, [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Delete',
        onPress: () => {
          this.props.handleDelete(this.props.data);
        },
      },
    ]);
  };

  render() {
    return (
      <View style={[styles.container]}>
        <Text style={styles.title}>{this.props.data.title}</Text>
        <Text style={styles.allowance}>{this.props.data.allowance}</Text>
        <View style={styles.controlList}>
          <Icon
            name="create"
            type="material"
            size={this.controlButtonSize}
            containerStyle={styles.controlButton}
            onPress={() => this.props.handleEdit(this.props.data)}
            color={ButtonColors.entryControl.edit}></Icon>
          <Icon
            name="delete"
            type="material"
            onPress={this.confirmAndDelete}
            size={this.controlButtonSize}
            containerStyle={styles.controlButton}
            color={ButtonColors.entryControl.delete}></Icon>

          <Icon
            name="swap-horiz"
            type="material"
            size={this.controlButtonSize}
            containerStyle={styles.controlButton}
            onPress={() => this.props.handleTransfer(this.props.data)}
            color={ButtonColors.entryControl.delete}></Icon>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 8,
    margin: 2,
    // borderRadius: 15,
    backgroundColor: 'white',
  },
  controlList: {
    flex: 2.5,
    flexDirection: 'row',
  },
  title: {
    fontSize: 16,
    flex: 4,
    fontWeight: 'bold',
    // color: 'steelblue',
  },
  allowance: {
    fontSize: 14,
    flex: 2,
    // paddingLeft: 5,
    // fontWeight: 'bold',
    // color: 'steelblue',
  },
  controlButton: {
    alignSelf: 'center',
    flex: 1,
    marginHorizontal: 2,
  },
});

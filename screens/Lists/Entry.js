import React, {Component} from 'react';
import {Alert, StyleSheet, Text, View} from 'react-native';
import {ButtonColors} from '../../styles/colors';
import EntryDBHandler from '../../databasehandler/entryhandler';
import {Icon} from 'react-native-elements';
import {dimensions} from '../../utils/constants';

export default class Entry extends Component {
  constructor(props) {
    super(props);
    this.controlButtonSize = dimensions.entry.controlButtonSize;
    this.entryHandler = new EntryDBHandler();
  }

  confirmAndDelete = () => {
    let entry = this.props.entry;
    let message = `Do you want to delete this entry ?\n
    Title: ${entry.title}
    Description: ${entry.description}
    Amount: ${entry.amount}
    Date: ${entry.date}
    Category: ${entry.category.title}
    Type: ${entry.category.type.toUpperCase()}`;
    Alert.alert('Entry Will Be Delete', message, [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Delete',
        onPress: () => {
          this.entryHandler.deleteEntry(entry).then((result) => {
            if (result.success) {
              this.props.refresh();
            }
          });
        },
      },
    ]);
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.controlButtonsContainer}>
          <Icon
            name="create"
            type="material"
            size={this.controlButtonSize}
            containerStyle={styles.controlButton}
            onPress={() =>
              this.props.navigation.navigate('UpdateEntry', {
                entry: this.props.entry,
                refresh: this.props.refresh,
              })
            }
            color={ButtonColors.entryControl.edit}></Icon>
          <Icon
            name="delete"
            type="material"
            size={this.controlButtonSize}
            containerStyle={styles.controlButton}
            color={ButtonColors.entryControl.delete}
            onPress={this.confirmAndDelete}></Icon>
        </View>
        <Text style={styles.categoryText}>
          {this.props.entry.category.title}
        </Text>
        <View style={styles.entryContainer}>
          <Text style={styles.entryText}>{this.props.entry.title}</Text>
          <Text style={styles.amountText}> $ {this.props.entry.amount}</Text>
        </View>
        {this.props.entry.description != '' && (
          <Text style={styles.descText}>{this.props.entry.description}</Text>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 4,
  },
  entryContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  entryText: {
    fontSize: dimensions.entry.titleText,
    fontWeight: 'bold',
    flex: 3,
  },
  amountText: {
    flex: 1,
    fontSize: dimensions.entry.amountText,
    textAlign: 'right',
  },
  categoryText: {
    color: 'grey',
    fontSize: dimensions.entry.categoryText,
  },
  descText: {
    color: 'grey',
    fontSize: dimensions.entry.desText,
  },
  controlButtonsContainer: {
    position: 'absolute',
    top: -3,
    right: -2,
    zIndex: 2,
    flexDirection: 'row',
  },
  controlButton: {
    marginLeft: dimensions.entry.controlButtonMargin,
  },
});

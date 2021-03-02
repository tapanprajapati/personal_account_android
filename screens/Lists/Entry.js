import React, {Component} from 'react';
import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {ButtonColors, ListColors} from '../../styles/colors';
import {getMonthName} from '../../utils/converters';
import EntryDBHandler from '../../databasehandler/entryhandler';
import {Icon} from 'react-native-elements';

export default class Entry extends Component {
  constructor(props) {
    super(props);
    this.controlButtonSize = 15;
    this.entryHandler = new EntryDBHandler();
    console.log(this.props.entry);
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.controlButtonsContainer}>
          <Icon
            name="create"
            type="material"
            size={this.controlButtonSize}
            style={styles.controlButton}
            onPress={() =>
              this.props.navigation.navigate('UpdateEntry', {
                entry: this.props.entry,
              })
            }
            color={ButtonColors.entryControl.edit}></Icon>
          <Icon
            name="delete"
            type="material"
            size={this.controlButtonSize}
            style={styles.controlButton}
            color={ButtonColors.entryControl.delete}></Icon>
        </View>
        <Text style={styles.categoryText}>
          {this.props.entry.category.title}
        </Text>
        <View style={styles.entryContainer}>
          <Text style={styles.entryText}>{this.props.entry.title}</Text>
          <Text style={styles.amountText}> $ {this.props.entry.amount}</Text>
        </View>
        <Text style={styles.descText}>{this.props.entry.description}</Text>
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
    fontSize: 14,
    fontWeight: 'bold',
    flex: 2,
  },
  amountText: {
    flex: 1,
    fontSize: 14,
    textAlign: 'right',
  },
  categoryText: {
    color: 'grey',
    fontSize: 10,
  },
  descText: {
    color: 'grey',
    fontSize: 10,
  },
  controlButtonsContainer: {
    position: 'absolute',
    top: -2,
    right: -2,
    zIndex: 2,
    flexDirection: 'row',
  },
  controlButton: {
    marginLeft: 2,
  },
});

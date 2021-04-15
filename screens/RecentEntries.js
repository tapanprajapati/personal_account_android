import React, {Component} from 'react';
import {Text} from 'react-native';
import {FlatList} from 'react-native';
import {View} from 'react-native';
import {StyleSheet} from 'react-native';
import EntryDBHandler from '../databasehandler/entryhandler';
import {TextColors} from './../styles/colors';

export default class RecentEntries extends Component {
  constructor(props) {
    super(props);
    this.entryHandler = new EntryDBHandler();
    this.state = {
      entries: [],
    };
  }

  componentDidMount() {
    this.getRecentEntries();
  }

  getRecentEntries = () => {
    this.entryHandler.getRecentEntries().then((entries) => {
      this.setState({
        entries: entries,
      });
    });
  };

  createEntryComponent = (entry) => {
    let color = TextColors.income;
    if (entry.category.type.toLowerCase() == 'expense') {
      color = TextColors.expense;
    }
    return (
      <View style={styles.entry}>
        <View style={styles.details}>
          <Text style={styles.entryTitle}>{entry.title}</Text>
          <Text style={styles.entryCategory}>{entry.category.title}</Text>
          <Text style={[styles.entryAmount, {color: color}]}>
            $ {entry.amount}
          </Text>
        </View>
        <View style={styles.date}>
          <Text style={styles.dateText}>{entry.date}</Text>
        </View>
      </View>
    );
  };

  render() {
    return (
      <View style={styles.main}>
        <FlatList
          style={styles.entryList}
          keyExtractor={(item) => `${item.id}`}
          data={this.state.entries}
          renderItem={({item}) => {
            return this.createEntryComponent(item);
          }}></FlatList>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  main: {},
  entry: {
    flexDirection: 'row',
    flex: 1,
    borderBottomColor: 'black',
    borderBottomWidth: 1,
    padding: 5,
  },
  entryList: {
    marginHorizontal: 5,
    marginVertical: 5,
  },
  entryTitle: {
    fontSize: 20,
    color: 'black',
    fontWeight: 'bold',
  },
  entryAmount: {
    fontSize: 17,
  },
  entryCategory: {
    color: 'grey',
  },
  details: {
    flex: 2,
  },
  date: {
    alignSelf: 'center',
  },
  dateText: {
    fontSize: 18,
  },
});

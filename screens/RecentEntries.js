import React, {Component} from 'react';
import {Text} from 'react-native';
import {FlatList} from 'react-native';
import {View} from 'react-native';
import {StyleSheet} from 'react-native';
import EntryDBHandler from '../databasehandler/entryhandler';
import {global} from '../styles/global';
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
      <View style={[styles.entryContainer, global.shadow]}>
        <View style={styles.slash1}></View>
        <View style={styles.slash2}></View>
        <View style={styles.slash3}></View>
        <View style={styles.slash4}></View>
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
  entryContainer: {
    padding: 10,
    margin: 5,
    // borderWidth: 1,
    // borderColor: 'black',
    overflow: 'hidden',
  },
  slash1: {
    position: 'absolute',
    height: 20,
    width: 100,
    top: -8,
    start: -5,
    backgroundColor: 'steelblue',
    transform: [{rotate: '-12deg'}],
  },
  slash2: {
    position: 'absolute',
    height: 20,
    width: 100,
    top: 10,
    start: -48,
    backgroundColor: 'steelblue',
    transform: [{rotate: '102deg'}],
  },

  slash3: {
    position: 'absolute',
    height: 20,
    width: 100,
    bottom: 10,
    end: -48,
    backgroundColor: 'steelblue',
    transform: [{rotate: '102deg'}],
  },
  slash4: {
    position: 'absolute',
    height: 20,
    width: 100,
    bottom: -10,
    end: -5,
    backgroundColor: 'steelblue',
    transform: [{rotate: '-12deg'}],
  },
  entry: {
    flexDirection: 'row',
    flex: 1,
    // borderBottomColor: 'black',
    // borderBottomWidth: 1,
    padding: 5,
    // borderWidth: 1,
    // borderColor: 'black'
  },
  entryList: {
    marginHorizontal: 5,
    marginVertical: 5,
  },
  entryTitle: {
    fontSize: 20,
    color: 'steelblue',
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

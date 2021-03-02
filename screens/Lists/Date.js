import React, {Component} from 'react';
import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {ListColors} from '../../styles/colors';
import {getMonthName} from '../../utils/converters';
import EntryDBHandler from '../../databasehandler/entryhandler';
import Entry from './Entry';

export default class Date extends Component {
  constructor(props) {
    super(props);
    this.state = {
      entries: [],
      amount: 0,
    };

    this.entryHandler = new EntryDBHandler();
  }

  getEntries = () => {
    let date = `${this.props.date}/${this.props.month}/${this.props.year}`;
    this.entryHandler.getEntries(date, null).then((result) => {
      this.setState({
        entries: result,
      });
      this.getTotal(result);
    });
  };

  getTotal = (entries) => {
    let total = 0;
    entries.forEach((entry) => {
      total += entry.amount;
    });

    this.setState({
      amount: total,
    });
  };

  componentDidMount() {
    this.getEntries();
  }
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>{this.props.date}</Text>
        <FlatList
          style={styles.listOfEntries}
          keyExtractor={(item) => {
            item.id;
          }}
          data={this.state.entries}
          renderItem={({item}) => {
            return <Entry navigation={this.props.navigation} entry={item} />;
          }}
        />
        <Text style={styles.footer}>$ {this.state.amount}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 1,
    elevation: 1,
    marginBottom: 10,
  },
  title: {
    textAlign: 'center',
    color: ListColors.yearList.title,
    backgroundColor: ListColors.yearList.background,
    fontSize: 16,
  },
  footer: {
    textAlign: 'center',
    color: ListColors.yearList.title,
    backgroundColor: ListColors.yearList.footer,
    fontSize: 16,
  },
  listOfEntries: {
    marginHorizontal: 10,
    marginVertical: 5,
  },
});

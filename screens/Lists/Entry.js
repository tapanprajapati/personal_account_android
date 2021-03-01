import React, {Component} from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';
import {ListColors} from '../../styles/colors';

export default class Year extends Component {
  constructor(props) {
    super(props);
  }

  getTotal(monthsData) {
    let total = 0;

    monthsData.forEach((monthData) => {
      total += monthData.amount;
    });

    return total;
  }

  listEntry(entry) {
    return (
      <View style={styles.monthContainer}>
        <Text style={styles.monthText}>{monthData.month}</Text>
        <Text style={styles.amountText}> $ {monthData.amount}</Text>
      </View>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>{this.props.data.date}</Text>
        <FlatList
          style={styles.list}
          keyExtractor={(item) => item.id}
          data={}
          renderItem={({item}) => {}}
        />
        <Text style={styles.footer}>
          $ {this.getTotal(this.props.data.months)}
        </Text>
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
  list: {
    marginHorizontal: 15,
    marginVertical: 5,
  },
  monthContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 2,
  },
  monthText: {
    fontSize: 14,
    fontWeight: 'bold',
    flex: 2,
  },
  amountText: {
    flex: 1,
    fontSize: 14,
    textAlign: 'right',
  },
});

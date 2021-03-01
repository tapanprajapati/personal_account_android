import React, {Component} from 'react';
import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {ListColors} from '../../styles/colors';
import {getMonthName} from '../../utils/converters';
import EntryDBHandler from '../../databasehandler/entryhandler';

export default class Year extends Component {
  constructor(props) {
    super(props);
    this.state = {
      months: [],
      amount: 0,
    };

    this.entryHandler = new EntryDBHandler();
  }

  getYearData = () => {
    this.entryHandler.getMonthsOfYear(this.props.year, null).then((result) => {
      this.setState({
        months: result,
      });
    });
  };

  addToTotal = (amount) => {
    let total = this.state.amount;
    total += amount;
    this.setState({
      amount: total,
    });
  };

  componentDidMount() {
    this.getYearData();
  }
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>{this.props.year}</Text>
        <FlatList
          style={styles.listOfMonths}
          keyExtractor={(item, index) => {
            item.month;
          }}
          data={this.state.months}
          renderItem={({item}) => {
            return (
              <Month
                passTotal={this.addToTotal}
                month={item}
                year={this.props.year}
              />
            );
          }}
        />
        <Text style={styles.footer}>$ {this.state.amount}</Text>
      </View>
    );
  }
}

class Month extends Component {
  constructor(props) {
    super(props);
    this.state = {
      amount: 0,
    };
    this.entryHandler = new EntryDBHandler();
  }

  componentDidMount() {
    let date = `${this.props.month}/${this.props.year}`;
    this.entryHandler.getMonthTotal(date, null).then((total) => {
      this.setState({
        amount: total,
      });

      this.props.passTotal(total);
    });
  }

  render() {
    return (
      <TouchableOpacity style={styles.monthContainer}>
        <Text style={styles.monthText}>{getMonthName(this.props.month)}</Text>
        <Text style={styles.amountText}> $ {this.state.amount}</Text>
      </TouchableOpacity>
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
  listOfMonths: {
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

import React, {Component} from 'react';
import {StyleSheet, Text} from 'react-native';
import {View} from 'react-native';
import EntryDBHandler from '../../databasehandler/entryhandler';
import {TextBackground} from '../../styles/colors';
import {dimensions} from '../../utils/constants';
import {
  formatLargeNumber,
  getMonthName,
  getSelectedCategories,
} from '../../utils/converters';

export default class MonthDifference extends Component {
  constructor(props) {
    super(props);
    this.state = {
      income: 0,
      expense: 0,
    };

    this.entryHandler = new EntryDBHandler();
  }

  getTotals = () => {
    const date = `${this.props.month}/${this.props.year}`;
    this.entryHandler
      .getSearchMonthTotal(
        '',
        date,
        getSelectedCategories(this.props.incomeCategories),
      )
      .then((amount) => {
        console.log(`Income: ${date}-> ${amount}`);
        this.setState({
          income: amount,
        });

        this.props.addToIncome(amount);
      });

    this.entryHandler
      .getSearchMonthTotal(
        '',
        date,
        getSelectedCategories(this.props.expenseCategories),
      )
      .then((amount) => {
        console.log(`Expense: ${date}-> ${amount}`);
        this.setState({
          expense: amount,
        });

        this.props.addToExpense(amount);
      });
  };

  componentDidMount() {
    this.getTotals();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.edit) {
      this.setState({
        income: 0,
        expense: 0,
      });
      this.getTotals();
    }
  }

  render() {
    const difference = this.state.income - this.state.expense;

    let diffColor = TextBackground.savingGreen;
    if (difference < 0) {
      diffColor = TextBackground.savingRed;
    }
    return (
      <View style={styles.main}>
        <Text style={styles.month}>{getMonthName(this.props.month)}</Text>
        <Text style={styles.income}>
          $ {formatLargeNumber(this.state.income)}
        </Text>
        <Text style={styles.expense}>
          $ {formatLargeNumber(this.state.expense)}
        </Text>
        <Text style={[styles.saving, {color: diffColor}]}>
          $ {formatLargeNumber(difference)}
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  main: {
    flexDirection: 'row',
    marginVertical: 2,
  },
  month: {
    flex: 1,
    fontSize: dimensions.difference.default,
    fontWeight: 'bold',
  },
  income: {
    flex: 1,
    fontSize: dimensions.difference.default,
  },
  expense: {
    flex: 1,
    fontSize: dimensions.difference.default,
  },
  saving: {
    flex: 1,
    fontSize: dimensions.difference.default,
  },
});

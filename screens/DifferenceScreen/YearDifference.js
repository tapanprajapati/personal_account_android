import React, {Component} from 'react';
import {StyleSheet} from 'react-native';
import {FlatList} from 'react-native';
import {View, Text} from 'react-native';
import EntryDBHandler from '../../databasehandler/entryhandler';
import {TextBackground} from '../../styles/colors';
import {dimensions} from '../../utils/constants';
import MonthDifference from './MonthDifference';

export default class YearDifference extends Component {
  constructor(props) {
    super(props);
    this.entryHandler = new EntryDBHandler();
    this.state = {
      months: [],
      income: 0,
      expense: 0,
    };
  }

  componentDidMount() {
    this.getMonths();
  }

  getMonths = () => {
    this.entryHandler.getMonths(this.props.year).then((months) => {
      console.log(`Months: ${this.props.year}`);
      console.log(months);
      this.setState({
        months: months,
      });
    });
  };

  addToIncome = (amount) => {
    amount = parseFloat(amount);
    this.setState({
      income: this.state.income + amount,
    });

    this.props.addToIncome(amount);
  };

  addToExpense = (amount) => {
    amount = parseFloat(amount);
    this.setState({
      expense: this.state.expense + amount,
    });

    this.props.addToExpense(amount);
  };

  render() {
    const difference = (this.state.income - this.state.expense).toFixed(2);

    let diffColor = TextBackground.savingGreen;
    if (difference < 0) {
      diffColor = TextBackground.savingRed;
    }
    return (
      <View style={styles.main}>
        <View>
          <Text style={styles.title}>{this.props.year}</Text>
        </View>
        <View style={styles.titleContainer}>
          <Text style={styles.titleMonth}>Month</Text>
          <Text style={styles.titleIncome}>Income</Text>
          <Text style={styles.titleExpense}>Expense</Text>
          <Text style={styles.titleSaving}>Saving</Text>
        </View>
        <FlatList
          style={styles.monthListContainer}
          data={this.state.months}
          keyExtractor={(item) => item}
          renderItem={({item}) => {
            return (
              <MonthDifference
                month={item}
                year={this.props.year}
                addToIncome={this.addToIncome}
                addToExpense={this.addToExpense}
              />
            );
          }}></FlatList>
        <View style={styles.totalContainer}>
          <Text style={styles.totalTitle}>Total</Text>
          <Text style={styles.totalIncome}>
            $ {this.state.income.toFixed(2)}
          </Text>
          <Text style={styles.totalExpense}>
            $ {this.state.expense.toFixed(2)}
          </Text>
          <Text style={[styles.totalSaving, {backgroundColor: diffColor}]}>
            $ {difference}
          </Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  main: {
    margin: 2,
    elevation: 10,
  },
  monthListContainer: {
    marginHorizontal: 3,
  },
  title: {
    fontSize: dimensions.difference.yearTitle,
    fontWeight: 'bold',
    backgroundColor: TextBackground.yearTitle,
    color: 'white',
    textAlign: 'center',
  },
  titleContainer: {
    flexDirection: 'row',
    margin: 2,
  },
  totalContainer: {
    flexDirection: 'row',
    margin: 2,
  },
  titleMonth: {
    flex: 1,
    textAlign: 'center',
    fontSize: dimensions.difference.default,
    fontWeight: 'bold',
    color: 'white',
    backgroundColor: TextBackground.yearTableTitle,
  },
  titleIncome: {
    flex: 1,
    textAlign: 'center',
    fontWeight: 'bold',
    color: 'white',
    fontSize: dimensions.difference.default,
    textAlignVertical: 'center',
    backgroundColor: TextBackground.yearTableTitle,
  },
  titleExpense: {
    flex: 1,
    textAlign: 'center',
    fontWeight: 'bold',
    textAlignVertical: 'center',
    fontSize: dimensions.difference.default,
    color: 'white',
    backgroundColor: TextBackground.yearTableTitle,
  },
  titleSaving: {
    flex: 1,
    textAlign: 'center',
    fontWeight: 'bold',
    textAlignVertical: 'center',
    fontSize: dimensions.difference.default,
    color: 'white',
    backgroundColor: TextBackground.yearTableTitle,
  },
  totalTitle: {
    flex: 1,
    fontSize: dimensions.difference.default,
    fontWeight: 'bold',
    backgroundColor: TextBackground.differenceTotal,
    color: 'white',
  },
  totalIncome: {
    flex: 1,
    // fontWeight: 'bold',
    color: 'white',
    fontSize: dimensions.difference.default,
    textAlignVertical: 'center',
    backgroundColor: TextBackground.differenceTotal,
  },
  totalExpense: {
    flex: 1,
    // fontWeight: 'bold',
    textAlignVertical: 'center',
    fontSize: dimensions.difference.default,
    color: 'white',
    backgroundColor: TextBackground.differenceTotal,
  },
  totalSaving: {
    flex: 1,
    // fontWeight: 'bold',
    textAlignVertical: 'center',
    fontSize: dimensions.difference.default,
    color: 'white',
  },
});

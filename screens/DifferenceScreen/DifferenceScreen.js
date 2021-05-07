import React, {Component} from 'react';
import {Text} from 'react-native';
import {FlatList} from 'react-native';
import {StyleSheet} from 'react-native';
import {RefreshControl} from 'react-native';
import {View} from 'react-native';
import EntryDBHandler from '../../databasehandler/entryhandler';
import {TextBackground} from '../../styles/colors';
import {dimensions} from '../../utils/constants';
import YearDifference from './YearDifference';

export default class Difference extends Component {
  constructor(props) {
    super(props);
    this.entryHandler = new EntryDBHandler();

    this.state = {
      years: [],
      income: 0,
      expense: 0,
      edit: false,
      refresh: false,
    };
  }

  addToIncome = (amount) => {
    amount = parseFloat(amount);
    this.setState({
      income: this.state.income + amount,
    });
  };

  addToExpense = (amount) => {
    amount = parseFloat(amount);
    this.setState({
      expense: this.state.expense + amount,
    });
  };

  getYears = () => {
    this.entryHandler.getYears().then((years) => {
      console.log(years);
      this.setState({
        years: years,
        refresh: false,
      });
    });
  };

  componentDidMount() {
    this.getYears();
  }

  refresh = () => {
    this.setState({
      edit: true,
      income: 0,
      expense: 0,
      refresh: true,
    });

    this.getYears();

    this.setState({
      edit: false,
    });
  };

  render() {
    const difference = (this.state.income - this.state.expense).toFixed(2);

    let diffColor = TextBackground.savingGreen;
    if (difference < 0) {
      diffColor = TextBackground.savingRed;
    }
    return (
      <View style={styles.main}>
        <View style={styles.yearsContainer}>
          <RefreshControl
            refreshing={this.state.refresh}
            onRefresh={() => setTimeout(this.refresh, 100)}>
            <FlatList
              data={this.state.years}
              keyExtractor={(item) => item}
              renderItem={({item}) => {
                return (
                  <YearDifference
                    year={item}
                    addToIncome={this.addToIncome}
                    edit={this.state.edit}
                    addToExpense={this.addToExpense}></YearDifference>
                );
              }}></FlatList>
          </RefreshControl>
        </View>
        <View style={styles.total}>
          <Text style={styles.totalTitle}>Total</Text>
          <Text style={styles.totalIncome}>
            $ {this.state.income.toFixed(2)}
          </Text>
          <Text style={styles.totalExpense}>
            $ {this.state.expense.toFixed(2)}
          </Text>
          <Text style={[styles.totalDifference, {backgroundColor: diffColor}]}>
            $ {difference}
          </Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  main: {
    height: '100%',
  },
  yearsContainer: {
    margin: 5,
  },
  total: {
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row',
    margin: 5,
  },
  totalTitle: {
    flex: 1,
    fontWeight: 'bold',
    color: 'white',
    textAlignVertical: 'center',
    fontSize: dimensions.difference.default,
    backgroundColor: TextBackground.differenceTotal,
  },
  totalIncome: {
    flex: 1,
    // fontWeight: 'bold',
    color: 'white',
    textAlignVertical: 'center',
    fontSize: dimensions.difference.default,
    backgroundColor: TextBackground.differenceTotal,
  },
  totalExpense: {
    flex: 1,
    // fontWeight: 'bold',
    textAlignVertical: 'center',
    color: 'white',
    fontSize: dimensions.difference.default,
    backgroundColor: TextBackground.differenceTotal,
  },
  totalDifference: {
    flex: 1,
    // fontWeight: 'bold',
    textAlignVertical: 'center',
    color: 'white',
    fontSize: dimensions.difference.default,
  },
});

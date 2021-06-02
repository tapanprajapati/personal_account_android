import React, {Component} from 'react';
import {ScrollView} from 'react-native';
import {StyleSheet} from 'react-native';
import CategoryLine from '../../components/graph/MonthlyComponents/CategoryLine';
import TypeDifference from '../../components/graph/MonthlyComponents/TypeDifference';

export default class MonthsGraphScreen extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <ScrollView style={styles.main}>
        <TypeDifference
          year={this.props.route.params.year}
          title="Months Summary"></TypeDifference>
        <CategoryLine
          year={this.props.route.params.year}
          title="Income Summary: Categories"
          type="income"
        />

        <CategoryLine
          year={this.props.route.params.year}
          title="Expense Summary: Categories"
          type="expense"
        />
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    padding: 5,
  },
});

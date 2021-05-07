import React, {Component} from 'react';
import {ScrollView} from 'react-native';
import {StyleSheet} from 'react-native';
import CategoryHorizontalBar from './YearlyComponents/CategoryHorizontalBar';
import CategoryLine from './YearlyComponents/CategoryLine';
import TypeDifference from './YearlyComponents/TypeDifference';

export default class YearsGraphScreen extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <ScrollView style={styles.main}>
        <TypeDifference
          navigation={this.props.navigation}
          title="Year Summary"></TypeDifference>
        <CategoryLine title="Income Summary: Categories" type="income" />

        <CategoryLine title="Expense Summary: Categories" type="expense" />
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

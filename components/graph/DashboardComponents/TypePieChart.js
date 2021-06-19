import React, {Component} from 'react';
import {global} from '../../../styles/global';
import {PieChart} from 'react-native-charts-wrapper';
import {StyleSheet, View, Text, processColor} from 'react-native';
import EntryDBHandler from '../../../databasehandler/entryhandler';
import {Graph, TextColors} from '../../../styles/colors';
import {formatLargeNumber} from '../../../utils/converters';

export default class TypePieChart extends Component {
  constructor(props) {
    super(props);
    this.entryHandler = new EntryDBHandler();
    this.state = {
      income: 0,
      expense: 0,
    };
  }

  componentDidMount() {
    const date = this.props.date;
    const monthYear =
      (date.getMonth() + 1 < 10
        ? '0' + (date.getMonth() + 1)
        : date.getMonth() + 1) +
      '/' +
      date.getFullYear();
    let expensePromise = this.entryHandler.getMonthTotal(monthYear, 'expense');
    let incomePromise = this.entryHandler.getMonthTotal(monthYear, 'income');

    Promise.all([expensePromise, incomePromise]).then((result) => {
      this.setState({
        expense: parseFloat(result[0]),
        income: parseFloat(result[1]),
      });
    });
  }

  render() {
    const diff = this.state.income - this.state.expense;
    return (
      <View style={styles.chartContainer}>
        <PieChart
          style={styles.chart}
          logEnabled={true}
          data={{
            dataSets: [
              {
                values: [
                  {value: this.state.expense, label: 'Expense'},
                  {value: this.state.income, label: 'Income'},
                ],
                label: 'Summary',
                config: {
                  drawValues: true,
                  colors: [
                    processColor(Graph.expense),
                    processColor(Graph.income),
                  ],
                  valueTextSize: 12,
                  valueTextColor: processColor('white'),
                  valueFormatter: '$#.##',
                },
              },
            ],
          }}
          legend={{
            enabled: false,
          }}
          chartDescription={{
            text: '',
          }}
          animation={{durationX: 1000, durationY: 1000, easingX: 'EaseInCirc'}}
          drawEntryLabels={false}
          rotationEnabled={true}
          rotationAngle={45}
          holeRadius={40}
          transparentCircleRadius={50}
          usePercentValues={false}
          styledCenterText={{
            text: '$' + formatLargeNumber(diff),
            color:
              diff < 0
                ? processColor(Graph.expense)
                : processColor(Graph.income),
            fontFamily: 'HelveticaNeue-Medium',
            size: 12,
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  chart: {
    flex: 1,
  },
  chartContainer: {
    flex: 1,
    padding: 5,
  },
});

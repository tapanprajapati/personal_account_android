import React, {Component} from 'react';
import {PieChart} from 'react-native-charts-wrapper';
import {StyleSheet, View, Text, processColor} from 'react-native';
import EntryDBHandler from '../../../databasehandler/entryhandler';
import {Graph, TextColors} from '../../../styles/colors';
import {formatLargeNumber} from '../../../utils/converters';

export default class TypePieChart extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
  }


  render() {
    const diff = this.props.income - this.props.expense;
    return (
      <View style={styles.chartContainer}>
        <PieChart
          style={styles.chart}
          logEnabled={true}
          data={{
            dataSets: [
              {
                values: [
                  {value: this.props.expense, label: 'Expense'},
                  {value: this.props.income, label: 'Income'},
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

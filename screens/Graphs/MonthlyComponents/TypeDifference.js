import React, {Component} from 'react';
import {StyleSheet} from 'react-native';
import {processColor, View} from 'react-native';
import {Text} from 'react-native';
import {BarChart} from 'react-native-charts-wrapper';
import EntryDBHandler from '../../../databasehandler/entryhandler';
import {Graph} from '../../../styles/colors';
import {global} from '../../../styles/global';

export default class TypeDifference extends Component {
  constructor(props) {
    super(props);

    this.state = {
      months: [
        '01',
        '02',
        '03',
        '04',
        '05',
        '06',
        '07',
        '08',
        '09',
        '10',
        '11',
        '12',
      ],
      monthNames: [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
      ],
      incomeData: [],
      expenseData: [],
    };

    this.entryHandler = new EntryDBHandler();
  }

  componentDidMount() {
    this.state.months.forEach((month) => {
      const monthYear = `${month}/${this.props.year}`;
      this.entryHandler.getMonthTotal(monthYear, 'expense').then((total) => {
        total = parseInt(total);
        this.setState({
          expenseData: [...this.state.expenseData, total],
        });
      });

      this.entryHandler.getMonthTotal(monthYear, 'income').then((total) => {
        total = parseInt(total);
        this.setState({
          incomeData: [...this.state.incomeData, total],
        });
      });
    });
  }

  render() {
    return (
      <View style={[styles.chartContainer, global.shadow]}>
        <Text style={global.graphTitle}>{this.props.title}</Text>
        <BarChart
          style={{flex: 1}}
          xAxis={{
            drawAxisLines: false,
            drawGridLines: true,
            position: 'BOTTOM',
            valueFormatter: this.state.monthNames,
            granularityEnabled: true,
            granularity: 1,
            axisMaximum: 12,
            axisMinimum: 0,
            centerAxisLabels: true,
            labelRotationAngle: 90,
            labelCount: 12,
          }}
          animation={{durationY: 1500}}
          yAxis={{
            right: {
              enabled: false,
            },
            left: {
              drawGridLines: false,
            },
          }}
          data={{
            dataSets: [
              {
                values: this.state.incomeData,
                label: 'Income',
                config: {
                  color: processColor(Graph.income),
                  drawValues: false,
                },
              },
              {
                values: this.state.expenseData,
                label: 'Expense',
                config: {
                  color: processColor(Graph.expense),
                  drawValues: false,
                },
              },
            ],
            config: {
              barWidth: 0.4,
              group: {
                fromX: 0,
                barSpace: 0.05,
                groupSpace: 0.1,
              },
            },
          }}
          legend={{
            enabled: true,
            textSize: 10,
            form: 'CIRCLE',
            formSize: 10,
            horizontalAlignment: 'RIGHT',
            verticalAlignment: 'TOP',
            wordWrapEnabled: true,
          }}
          drawValueAboveBar={false}
          // onSelect={this.handleSelect.bind(this)}
          // onChange={(event) => console.log(event.nativeEvent)}
          // highlights={this.state.highlights}
          marker={{
            enabled: true,
          }}
          chartDescription={{
            text: '',
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  chartContainer: {
    flex: 1,
    height: 300,
    margin: 10,
    padding: 4,
    backgroundColor: 'white',
    borderRadius: 15,
  },
});

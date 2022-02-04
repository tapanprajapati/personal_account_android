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
      years: [],
      incomeData: [],
      expenseData: [],
    };

    this.entryHandler = new EntryDBHandler();
  }

  componentDidMount() {
    this.entryHandler.getYears().then((result) => {
      if(result.success)
      {
        let years = result.message;
        years = years.sort()
        this.setState({
          years: years,
        });
  
        console.log(years.length)
        let a = []
        years.forEach(i=>{a.push(0)})
        
        this.setState({incomeData: a,expenseData: a})
        
        years.forEach((year,ind) => {
          this.entryHandler.getYearsTotal(year, 'expense').then((result) => {
            if(result.success)
            {
              let total = parseInt(result.message);
              let tempA = [...this.state.expenseData]
              tempA[years.indexOf(year)] = total;
              this.setState({
                expenseData: tempA
              })
            }
            else
            {
              Alert.alert('ERROR', `${result.message.toUpperCase()}`, [
            {
              text: 'Close',  
            },
          ]);
            }
          });
  
          this.entryHandler.getYearsTotal(year, 'income').then((result) => {
            if(result.success)
            {
              let total = parseInt(result.message);
              
              let tempA = [...this.state.incomeData]
              tempA[years.indexOf(year)] = total;
              this.setState({
                incomeData: tempA
              })
            }
            else
            {
              Alert.alert('ERROR', `${result.message.toUpperCase()}`, [
            {
              text: 'Close',  
            },
          ]);
            }
          });
        });
      }
      else
      {
        Alert.alert('ERROR', `${result.message.toUpperCase()}`, [
            {
              text: 'Close',  
            },
          ]);
      }
    });
  }

  handleSelect = (data) => {
    let x = parseInt(data.nativeEvent.x);

    const yearSelected = this.state.years[x];

    this.props.navigation.navigate('MonthsGraphs', {year: yearSelected});
  };

  render() {
    return (
      <View style={[styles.chartContainer, global.shadow]}>
        <Text style={global.graphTitle}>{this.props.title}</Text>
        <BarChart
          style={{flex: 1}}
          xAxis={{
            drawAxisLines: false,
            drawGridLines: false,
            position: 'BOTTOM',
            valueFormatter: this.state.years,
            granularityEnabled: true,
            granularity: 1,
            axisMaximum: this.state.years.length,
            axisMinimum: 0,
            centerAxisLabels: true,
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
                  valueTextColor: processColor('white'),
                  valueTextSize: 10,
                },
              },
              {
                values: this.state.expenseData,
                label: 'Expense',
                config: {
                  color: processColor(Graph.expense),
                  valueTextColor: processColor('white'),
                  valueTextSize: 10,
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
          onSelect={this.handleSelect.bind(this)}
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

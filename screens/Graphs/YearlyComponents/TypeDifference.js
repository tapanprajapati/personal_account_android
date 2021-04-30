import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { processColor, View } from 'react-native';
import { Text } from 'react-native';
import { BarChart } from 'react-native-charts-wrapper';
import EntryDBHandler from '../../../databasehandler/entryhandler';
import { Graph } from '../../../styles/colors';
import { global } from '../../../styles/global';

export default class TypeDifference extends Component{
    constructor(props)
    {
        super(props)

        this.state = {
          years: [],
          incomeData: [],
          expenseData: []
        }

        this.entryHandler = new EntryDBHandler()

    }

    componentDidMount() {
      this.entryHandler.getYears().then(years => {
        this.setState({
          years: years
        })

        years.forEach(year=>{
          this.entryHandler.getYearsTotal(year,'expense').then(total=>{
            this.setState({
              expenseData : [...this.state.expenseData,total]
            })
          })

          this.entryHandler.getYearsTotal(year,'income').then(total=>{
            this.setState({
              incomeData : [...this.state.incomeData,total]
            })
          })
        })
      })
    }

    render(){
        return(
          <View style={[styles.chartContainer,global.shadow]}>
              <Text style={global.graphTitle}>{this.props.title}</Text>
            <BarChart
            style={{flex: 1}}
            xAxis={{
              drawAxisLines: false,
              drawGridLines: false,
              position: "BOTTOM",
              valueFormatter: this.state.years,
              granularityEnabled: true,
              granularity: 1,
              axisMaximum: this.state.years.length,
              axisMinimum: 0,
              centerAxisLabels: true,
            }}
            animation={{durationY: 1500}}
            yAxis={{
              right:{
                enabled:false
              },
              left:{
                drawGridLines: false
              }
            }}
            data={{
              dataSets:[
                {
                  values: this.state.incomeData,
                  label:"Income",
                  config:{
                    color: processColor(Graph.income),
                    valueTextColor: processColor("white"),
                    valueTextSize: 10,
                    
                  }
                },
                {
                  values: this.state.expenseData,
                  label: "Expense",
                  config:{
                    color: processColor(Graph.expense),
                    valueTextColor: processColor("white"),
                    valueTextSize: 10
                  }
                }
              ],
              config:{
                barWidth: 0.4,
                group:{
                  fromX: 0,
                  barSpace: 0.05,
                  groupSpace: 0.1
                }
              }
            }}
            legend={{
              enabled: true,
              textSize: 10,
              form: "CIRCLE",
              formSize: 10,
              horizontalAlignment:"RIGHT",
              verticalAlignment: "TOP",
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
              text:""
            }}
            
          />
            </View>
        )
    }
}

const styles=StyleSheet.create({
    chartContainer:{
      flex: 1,
      height: 300,
      margin: 10,
      padding: 4,
      backgroundColor: 'white',
      borderRadius: 15
  },
})
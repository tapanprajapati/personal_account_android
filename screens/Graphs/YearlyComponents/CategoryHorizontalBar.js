import React, { Component } from 'react';
import { processColor, StyleSheet, Text, View } from 'react-native';
import { HorizontalBarChart } from 'react-native-charts-wrapper';
import CategoryDBHandler from '../../../databasehandler/categoryhandler';
import { Graph } from '../../../styles/colors';
import { global } from '../../../styles/global';

export default class CategoryHorizontalBar extends Component{
    constructor(props)
    {
        super(props)

        this.state = {
            categories: []
        }

        this.categoryHanlder = new CategoryDBHandler()
    }

    componentDidMount()
    {
        let method = undefined

        if(this.props.year==undefined)
        {
            method = this.categoryHanlder.getCategoryTotal(this.props.type)
        }
        else
        {
            method = this.categoryHanlder.getCategoryTotalByYear(this.props.year,this.props.type)
        }

        method.then(categories=>{
            this.setState({
                categories: categories
            })
        })

    }

    getData = () => {
        let dataSets = []
        let values = []
        this.state.categories.forEach(category=> {
            values.push({y: category.total})
        })

        dataSets.push({
            values: values,
            label: 'Bar dataSet',
            config: {
              color: processColor(Graph.random()),

            }
        })

        
        return {
            dataSets: dataSets
        }
    }

    getCategoryTitles = () => {
        let titles = []

        this.state.categories.forEach(category => {
            titles.push(category.title)
        })
        return titles
        
    }

    render()
    {
        return(
            <View style={styles.chartContainer}>
              <HorizontalBarChart
              style={{flex: 1}} 
              legend={
                {
                    enabled: false,
                  }
              }

              data = {this.getData()}

              xAxis={
                {
                    valueFormatter: this.getCategoryTitles(),
                    position: 'BOTTOM',
                    granularityEnabled: true,
                    granularity: 1,
                    drawGridLines: false,
                    labelCount: this.state.categories.length  
                }
              }

              yAxis={
                {
                    left:{enabled: false},
                    right:{enabled: false}
                }
              }

              chartDescription={{
                  text: ""
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
      marginTop: 20
    //   margin: 10,
    //   padding: 4,
    //   backgroundColor: 'white',
    //   borderRadius: 15
  },
})
import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { Text } from 'react-native';
import { Modal } from 'react-native';
import { processColor, View } from 'react-native';
import { LineChart } from 'react-native-charts-wrapper';
import { Icon } from 'react-native-elements';
import CategoryDBHandler from '../../../databasehandler/categoryhandler';
import EntryDBHandler from '../../../databasehandler/entryhandler';
import { Graph } from '../../../styles/colors';
import { global } from '../../../styles/global';
import CategoryFilterModal from '../../CategoryFilterModal';
import CategoryHorizontalBar from './CategoryHorizontalBar';

export default class CategoryLine extends Component{
    constructor(props)
    {
        super(props)

        this.state = {
            categories:[],
            years: [],
            data:{},
            showCategoryModal: false
        }

        this.categoryHandler = new CategoryDBHandler()
        this.entryHandler = new EntryDBHandler()
    }

    componentDidMount(){
        // GET CATEGORIES FROM TYPE props.type

        this.entryHandler.getYears().then(years=>{

            // this.setState({years: years})
            years.forEach(year=>{
                this.categoryHandler.getCategoryTotalByYear(year,this.props.type).then(categories=>{
                    let data = this.state.data
                    data[year] = categories
                    
                    this.setState({data: data})
                    
                    this.setCategories(categories)
                    this.setState({years: [...this.state.years,year]})
                })
            })
        })
    }

    setCategories = (categories) => {

        if(this.state.categories.length > 0)
        {
            return
        }

        let tempCats = []

        categories.forEach(category=>{
            tempCats.push({
                category:{
                    id: category.id,
                    title: category.title
                },
                status: true
            })
        })

        this.setState({
            categories: tempCats
        })
    }

    getData = () => {
        let dataSets = []

        this.state.categories.forEach(category=>{
            if(category.status)
            {
                let values = []
                this.state.years.forEach(year=>{
                    values.push({
                        x: parseFloat(year),
                        y: this.getTotal(year,category.category.id)
                    })
                })

                const c = processColor(Graph.random())

                dataSets.push({
                    values: values,
                    label: category.category.title,
                    config:{
                        valueTextSize: 10,
                        color: c,
                        circleColor: c
                    }
                })
            }
        })

        return {
            dataSets: dataSets
        }
    }

    getTotal = (year,id) => {
        let total = 0
        this.state.data[year].forEach(category=>{
            // console.log(category)
            if(category.id==id)
            {
                total = category.total
            }
        })

        return total
    }

    getXMin = () => {
        if(this.state.years.length==0)
            return 0
        
        return (parseInt(this.state.years[0])-1)
    }

    getXMax = () => {
        if(this.state.years.length==0)
            return 0
        
        return (parseInt(this.state.years[this.state.years.length-1])+1)
    }

    saveCategories = (categories) => {
        this.setState({
          categories: categories,
        });
    };

    render(){

        return(
            <View style={[styles.chartContainer,global.shadow]}>

                 <View style={styles.titleContainer}>

                    <Text style={global.graphTitle}>{this.props.title}</Text>
                    <Icon
                    containerStyle={styles.filter}
                        name="filter-outline"
                        type="ionicon"
                        raised
                        color="#396884"
                        reverse
                        size={10}
                        onPress={() => {
                            this.setState({showCategoryModal: true});
                        }}
                    />

                 </View>
                <LineChart
                    style={{flex: 1}}
                    data={this.getData()}
                    // data={{
                        // dataSets:[{config:{}}]
                    // }}
                    xAxis={{
                        valueFormatter: " ",
                        granularityEnabled: true,
                        granularity: 1,
                        position: 'BOTTOM',
                        axisMaximum: this.getXMax(),
                        axisMinimum: this.getXMin(),
                        drawAxisLines: false,
                        drawGridLines: false,
                      }}

                      yAxis={{
                          right:{
                              enabled: false

                          },
                          left:{
                              drawGridLines: false
                          }
                      }}

                      legend={{
                        //   orientation: "VERTICAL",
                          verticalAlignment:"BOTTOM",
                          horizontalAlignment: "LEFT",
                          wordWrapEnabled: true,
                          form: "CIRCLE",
                      }}

                      chartDescription={{
                          text: ""
                      }}

                      animation={{
                          durationX: 1500
                      }}
                />

                
                <CategoryHorizontalBar type={this.props.type} />

                <Modal
                transparent={true}
                visible={this.state.showCategoryModal}
                onRequestClose={() => this.setState({showCategoryModal: false})}
                >
                <CategoryFilterModal
                    categories={this.state.categories}
                    saveChanges={this.saveCategories}
                    close={() => this.setState({showCategoryModal: false})}
                />
                </Modal>

            </View>
        )
    }
}

const styles = StyleSheet.create({
    filter:{
        position: 'absolute',
        end: 0
    },
    chartContainer:{
        flex: 1,
        height: 600,
        margin: 10,
        padding: 4,
        backgroundColor: 'white',
        borderRadius: 15
    },
})
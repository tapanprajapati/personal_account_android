import React,{ Component } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { TextColors } from "../styles/colors";
import { formatLargeNumber } from "../utils/converters";

export default class DashboardCategoryTotal extends Component
{
    constructor(props)
    {
        super(props)
        console.log(props.data)
        console.log(props.YTD)
    }
    render()
    {
        return(
        <View style={[styles.container]}>
            <Text style={styles.title}>{this.props.type}</Text>
            <View style={styles.categoryContainer}>
                <Text style={styles.categoryTitle}>
                    Title
                </Text>
                <Text style={styles.categoryTotal}>
                    Limit
                </Text>
                <Text style={styles.categoryTotal}>
                    Month
                </Text>
                <Text style={styles.categoryTotal}>
                    YTD
                </Text>
                <Text style={styles.categoryTotal}>
                    YTD Rem.
                </Text>
            </View>
            <FlatList style={styles.categorylist}
                keyExtractor={(item) => `${item.title}`}
                data={this.props.data}
                renderItem={({item, index}) => {
                    let totalC = (item.total>item.allowance) ? TextColors.expense : TextColors.income;
                    let YTD = (this.props.YTD[index]) ? this.props.YTD[index].total : 0;
                    let totalYTDC = (YTD > item.allowance*12) ? TextColors.expense : TextColors.income;

                    if(this.props.type=="Income")
                    {
                        totalC = (item.total<item.allowance) ? TextColors.expense : TextColors.income;
                        totalYTDC = (YTD < item.allowance*12) ? TextColors.expense : TextColors.income;
                    }
                    return (
                    <View style={styles.categoryContainer}>
                        <Text style={styles.categoryTitle}>
                            {item.title}
                        </Text>
                        <Text style={styles.categoryTotal}>
                            {item.allowance}
                        </Text>
                        <Text style={[styles.categoryTotal,{color: totalC}]}>
                           {formatLargeNumber(item.total)}
                        </Text>
                        <Text style={[styles.categoryTotal,{color: totalYTDC}]}>
                           {formatLargeNumber(YTD)}
                        </Text>
                        <Text style={[styles.categoryTotal,{color: totalYTDC}]}>
                           {formatLargeNumber(item.allowance*12 - YTD)}
                        </Text>
                    </View>
                    );
                }}/>
        </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        overflow:"scroll"
    },
    title:{
        alignSelf: 'center',
        fontWeight: 'bold',
        color: 'steelblue',
        fontSize: 20,
    },
    categoryContainer:{
        margin:5,
        flexDirection:'row'
    },
    categoryTitle:{
        flex: 1.3,fontWeight:'bold'
    },
    categoryTotal:{flex: 0.8,fontWeight:'bold'}
})
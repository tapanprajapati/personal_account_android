import React,{ Component } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { formatLargeNumber } from "../utils/converters";

export default class DashboardCategoryTotal extends Component
{
    constructor(props)
    {
        super(props)
    }
    render()
    {
        return(
        <View style={[styles.container]}>
            <Text style={styles.title}>{this.props.type}</Text>
            <FlatList style={styles.categorylist}
                keyExtractor={(item) => `${item.title}`}
                data={this.props.data}
                renderItem={({item}) => {
                    return (
                    <View style={styles.categoryContainer}>
                        <Text style={styles.categoryTitle}>
                            {item.title}
                        </Text>
                        <Text style={styles.categoryTotal}>
                           $ {formatLargeNumber(item.total)}
                        </Text>
                    </View>
                    );
                }}/>
        </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {},
    title:{
    alignSelf: 'center',
    fontWeight: 'bold',
    color: 'steelblue',
    fontSize: 20,},
    categoryContainer:{
        margin:5,
        flexDirection:'row'
    },
    categoryTitle:{
        flex: 1.5,fontWeight:'bold'
    },
    categoryTotal:{flex: 1,fontWeight:'bold'}
})
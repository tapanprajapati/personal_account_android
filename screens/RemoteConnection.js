import React, { Component } from 'react';
import { Text } from 'react-native';
import { View } from 'react-native';
import CategoryDBHandler from '../databasehandler/categoryhandler';
import EntryDBHandler from './../databasehandler/entryhandler'

export default class RemoteConnection extends Component{
    constructor(props)
    {
        super(props)
        this.entryHandler = new EntryDBHandler()
        this.categoryHandler = new CategoryDBHandler()
    }

    render()
    {
        return(
            <View>
                <Text>Hello</Text>
            </View>
        )
    }
}
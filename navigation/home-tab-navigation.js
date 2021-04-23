import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import AccountType from '../screens/AccountTypeScreen'
import React from 'react';
import Difference from '../screens/DifferenceScreen/DifferenceScreen';
import { useEffect } from 'react';
import checkAndCreateDatabase from '../databasehandler/dbinit';
import { Icon } from 'react-native-elements';

const Tab = createMaterialTopTabNavigator()

export default function HomeTabNavigation(props){

    useEffect(()=>{
            props.navigation.setOptions({
              headerRight: () => (
                <Icon
                  containerStyle={{marginRight: 10}}
                  name="history"
                  type="material"
                  color="white"
                  onPress={() => {
                    props.navigation.navigate('RecentEntries');
                  }}
                />
              ),
            });
            checkAndCreateDatabase()
    },[])

    return(
        <Tab.Navigator>
            <Tab.Screen name='Expense' component={AccountType} initialParams={{type:'Expense'}}></Tab.Screen>
            <Tab.Screen name='Income' component={AccountType} initialParams={{type:'Income'}}></Tab.Screen>
            <Tab.Screen name='Difference' component={Difference}></Tab.Screen>
        </Tab.Navigator>
    )
}
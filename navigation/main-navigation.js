import React from 'react';
import {View, Text} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Home from '../screens/HomeScreen/HomeScreen';
import {HeaderColors} from '../styles/colors';
import AccountType from '../screens/AccountTypeScreen';
import AddEntry from '../screens/DataEntry/AddScreen';
import EntryList from '../screens/EntryListScreen';
import {getMonthName} from '../utils/converters';
import UpdateEntry from '../screens/DataEntry/UpdateScreen';

export default function HomeNavigation() {
  const Stack = createStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: HeaderColors.background,
            height: 35,
          },
          headerTintColor: HeaderColors.titleText,
          headerTitleStyle: {
            fontSize: 16,
          },
        }}
        initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={Home}
          options={{title: 'Personal Account'}}
        />
        <Stack.Screen
          name="AddEntry"
          component={AddEntry}
          options={{
            title: 'Add Entry',
            headerTitleContainerStyle: {
              left: 45,
            },
          }}
        />
        <Stack.Screen
          name="UpdateEntry"
          component={UpdateEntry}
          options={{
            title: 'Update Entry',
            headerTitleContainerStyle: {
              left: 45,
            },
          }}
        />
        <Stack.Screen
          name="AccountType"
          component={AccountType}
          options={({route}) => ({
            title: route.params.type,

            headerTitleContainerStyle: {
              left: 45,
            },
          })}
        />

        <Stack.Screen
          name="EntryList"
          component={EntryList}
          options={({route}) => ({
            title: `${route.params.type}: ${
              route.params.year
            } -> ${getMonthName(route.params.month)}`,

            headerTitleContainerStyle: {
              left: 45,
            },
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

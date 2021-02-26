import React from 'react';
import {View, Text} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Home from '../screens/HomeScreen/HomeScreen';
import {HeaderColors} from '../styles/colors';
import AccountType from '../screens/AccountTypeScreen';
import AddEntry from '../screens/DataEntry/AddScreen';

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
          options={{title: 'Add Entry'}}
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
      </Stack.Navigator>
    </NavigationContainer>
  );
}

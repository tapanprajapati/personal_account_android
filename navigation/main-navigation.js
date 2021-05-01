import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {HeaderColors} from '../styles/colors';
import AccountType from '../screens/AccountTypeScreen';
import AddEntry from '../screens/DataEntry/AddScreen';
import EntryList from '../screens/EntryListScreen';
import {getMonthName} from '../utils/converters';
import UpdateEntry from '../screens/DataEntry/UpdateScreen';
import RecentEntries from '../screens/RecentEntries';
import Difference from '../screens/DifferenceScreen/DifferenceScreen';
import HomeTabNavigation from './home-tab-navigation';
import YearsGraphScreen from '../screens/Graphs/YearsGraphScreen';
import MonthsGraphScreen from '../screens/Graphs/MonthsGraphScreen';

export default function HomeNavigation() {
  const Stack = createStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: HeaderColors.background,
          },
          headerTintColor: HeaderColors.titleText,
        }}
        initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={HomeTabNavigation}
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
          name="Difference"
          component={Difference}
          options={{
            title: 'Difference',
            headerTitleContainerStyle: {
              left: 45,
            },
          }}
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
        <Stack.Screen
          name="RecentEntries"
          component={RecentEntries}
          options={{
            title: 'Recent Entries',
            headerTitleContainerStyle: {
              left: 45,
            },
          }}
        />

        <Stack.Screen
          name="Graphs"
          component={YearsGraphScreen}
          options={{title: 'Graphs'}}
        />

        <Stack.Screen
          name="MonthsGraphs"
          component={MonthsGraphScreen}
         options={({route}) => ({
            title: `Graphs: ${route.params.year}`,

            headerTitleContainerStyle: {
              left: 45,
            },
          })}
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
}

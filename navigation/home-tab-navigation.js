import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import AccountType from '../screens/AccountTypeScreen';
import React from 'react';
import Difference from '../screens/DifferenceScreen/DifferenceScreen';
import {useEffect} from 'react';
import {View, StyleSheet} from 'react-native';
import checkAndCreateDatabase from '../databasehandler/dbinit';
import {Icon} from 'react-native-elements';
import Menu, {MenuItem} from 'react-native-material-menu';
import DocumentPicker from 'react-native-document-picker';
import BackupHandler from '../backupmanager/BackupHandler';
import {ToastAndroid} from 'react-native';
import DashboardScreen from '../screens/DashboardScreen';

const Tab = createMaterialTopTabNavigator();

export default function HomeTabNavigation(props) {
  backupHandler = new BackupHandler();

  useEffect(() => {
    _menu = null;

    setMenuRef = (ref) => {
      _menu = ref;
    };

    show = () => {
      _menu.show();
    };

    hide = () => {
      _menu.hide();
    };
    props.navigation.setOptions({
      headerRight: () => (
        <View style={styles.headerRight}>
          <Icon
            containerStyle={{marginRight: 10}}
            name="history"
            type="material"
            color="white"
            onPress={() => {
              props.navigation.navigate('RecentEntries');
            }}
          />

          <Icon
            containerStyle={{marginRight: 10}}
            name="insights"
            type="material"
            color="white"
            onPress={() => {
              props.navigation.navigate('Graphs');
            }}
          />

          <Menu
            ref={setMenuRef}
            button={
              <Icon
                containerStyle={{marginRight: 10}}
                name="more-vert"
                type="material"
                color="white"
                onPress={show}
              />
            }>
            <MenuItem onPress={exportData}>Backup</MenuItem>
            <MenuItem onPress={openPicker}>Restore</MenuItem>
            <MenuItem
              onPress={() => {
                props.navigation.navigate('ManageCategories');
                hide();
              }}>
              Manage Categories
            </MenuItem>
          </Menu>
          {/* <Icon
                  containerStyle={{marginRight: 10}}
                  name="more-vert"
                  type="material"
                  color="white"
                  onPress={() => {
                    props.navigation.navigate('RecentEntries');
                  }}
                /> */}
        </View>
      ),
    });
    checkAndCreateDatabase();
  }, []);

  openPicker = () => {
    DocumentPicker.pick().then((res) => {
      backupHandler.importData(res.uri);
    });
  };

  exportData = () => {
    backupHandler.exportData().then(
      (success) => {
        ToastAndroid.show(
          "Exported to: 'Downloads/personalaccountsbackup.json'",
          ToastAndroid.LONG,
        );
      },
      (error) => {
        ToastAndroid.show('Error Exporting Data', ToastAndroid.LONG);
      },
    );
    console.log('Export Pressed');
  };

  return (
    <Tab.Navigator
      tabBarOptions={{
        labelStyle: {
          textTransform: 'capitalize',
          // fontSize: 10,
          fontWeight: 'bold',
          margin: 0,
        },
      }}>
      <Tab.Screen name="Dashboard" component={DashboardScreen}></Tab.Screen>
      <Tab.Screen
        name="Expense"
        component={AccountType}
        initialParams={{type: 'Expense'}}></Tab.Screen>
      <Tab.Screen
        name="Income"
        component={AccountType}
        initialParams={{type: 'Income'}}></Tab.Screen>
      <Tab.Screen name="Difference" component={Difference}></Tab.Screen>
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  headerRight: {
    flexDirection: 'row',
  },
});

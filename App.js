/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {
  StyleSheet,
} from 'react-native';
import HomeNavigation from './navigation/main-navigation';
import Amplify from 'aws-amplify';
import awsconfig from './src/aws-exports'

Amplify.configure(awsconfig);

const App = () => {
  return <HomeNavigation />;
};

const styles = StyleSheet.create({});

export default App;

import React, {Component} from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';
import {Icon} from 'react-native-elements';
import {ButtonColors} from '../styles/colors';
import {global} from '../styles/global';
import Year from './Lists/Year';

export default class AccountType extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let years = [
      {
        year: '2021',
        months: [
          {
            month: 'May',
            amount: 1000,
          },
          {
            month: 'May',
            amount: 1000,
          },
          {
            month: 'May',
            amount: 1000,
          },
        ],
      },
      {
        year: '2022',
        months: [
          {
            month: 'May',
            amount: 1000,
          },
          {
            month: 'May',
            amount: 1000,
          },
          {
            month: 'May',
            amount: 1000,
          },
        ],
      },
      {
        year: '2023',
        months: [
          {
            month: 'May',
            amount: 1000,
          },
          {
            month: 'May',
            amount: 1000,
          },
          {
            month: 'May',
            amount: 1000,
          },
        ],
      },
      {
        year: '2024',
        months: [
          {
            month: 'May',
            amount: 1000,
          },
          {
            month: 'May',
            amount: 1000,
          },
          {
            month: 'May',
            amount: 1000,
          },
        ],
      },
      {
        year: '2026',
        months: [
          {
            month: 'May',
            amount: 1000,
          },
          {
            month: 'May',
            amount: 1000,
          },
          {
            month: 'May',
            amount: 1000,
          },
        ],
      },
      {
        year: '2025',
        months: [
          {
            month: 'May',
            amount: 1000,
          },
          {
            month: 'May',
            amount: 1000,
          },
          {
            month: 'May',
            amount: 1000,
          },
        ],
      },
    ];
    return (
      <View style={global.container}>
        <FlatList
          style={styles.yearList}
          data={years}
          keyExtractor={(item) => item.year}
          renderItem={({item}) => {
            return <Year data={item} />;
          }}
        />
        <View style={global.floatingButton}>
          <Icon
            raised
            color={ButtonColors.floatingAdd}
            name="add"
            type="material"
            reverse
            onPress={() => this.props.navigation.navigate('AddEntry')}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  yearList: {
    marginHorizontal: 5,
  },
});

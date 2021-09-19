import React, {Component} from 'react';
import {StyleSheet} from 'react-native';
import {Text, View, TouchableOpacity} from 'react-native';
import CategoryHorizontalBar from '../components/graph/DashboardComponents/CategoryHorizontalBar';
import TypePieChart from '../components/graph/DashboardComponents/TypePieChart';
import {global} from '../styles/global';
import {getMonthName} from '../utils/converters';
import {Picker} from '@react-native-picker/picker';
import MonthYearPicker from '../modals/MonthYearPicker';

export default class DashboardScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      date: new Date(),
      isDatePickerVisible: false,
    };
  }

  saveDate = (date) => {
    this.setState({
      date: date,
    });
  };

  render() {
    return (
      <View style={global.container}>
        <View style={styles.first}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => {
              this.setState({isDatePickerVisible: true});
            }}
            style={styles.dateContainer}>
            <View style={[styles.monthContainer, global.shadow]}>
              <Text style={styles.month}>
                {getMonthName(
                  this.state.date.getMonth() + 1,
                  'short',
                ).toUpperCase()}
              </Text>
            </View>
            <View style={styles.yearContainer}>
              <Text style={styles.year}>{this.state.date.getFullYear()}</Text>
            </View>
          </TouchableOpacity>

          <View style={styles.pieChart}>
            <TypePieChart date={this.state.date} />
          </View>
        </View>
        <View style={styles.categoryChartsContainer}>
          <View style={[styles.categoryChart, global.shadow]}>
            <Text style={styles.categoryChartTitle}>
              Income Category Summary
            </Text>
            <CategoryHorizontalBar
              navigation={this.props.navigation}
              date={this.state.date}
              type="income"
            />
          </View>

          <View style={[styles.categoryChart, global.shadow]}>
            <Text style={styles.categoryChartTitle}>
              Expense Category Summary
            </Text>
            <CategoryHorizontalBar
              navigation={this.props.navigation}
              date={this.state.date}
              type="expense"
            />
          </View>
        </View>
        <MonthYearPicker
          isVisible={this.state.isDatePickerVisible}
          close={() => this.setState({isDatePickerVisible: false})}
          saveDate={this.saveDate}
          date={this.state.date}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  first: {
    height: 200,
    flexDirection: 'row',
  },
  dateContainer: {
    alignSelf: 'center',
    width: 120,
    marginStart: 20,
  },
  monthContainer: {
    backgroundColor: '#fff',
    paddingVertical: 20,
    alignItems: 'center',
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
  yearContainer: {
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: 'steelblue',
    borderBottomRightRadius: 5,
    borderBottomLeftRadius: 5,
  },
  month: {
    fontWeight: 'bold',
    fontSize: 25,
    color: 'orange',
  },
  year: {
    fontWeight: 'bold',
    color: '#fff',
    fontSize: 20,
  },
  pieChart: {
    flex: 1,
  },

  categoryChartsContainer: {
    flex: 1,
    // flexDirection: 'row',
  },
  categoryChart: {
    flex: 1,
    margin: 5,
    borderRadius: 10,
    backgroundColor: '#fff',
  },
  categoryChartTitle: {
    alignSelf: 'center',
    fontWeight: 'bold',
    color: 'steelblue',
    marginTop: 5,
    fontSize: 15,
  },
});

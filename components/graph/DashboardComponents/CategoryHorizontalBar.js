import React, {Component} from 'react';
import {processColor, StyleSheet, Text, View} from 'react-native';
import {HorizontalBarChart, BarChart} from 'react-native-charts-wrapper';
import CategoryDBHandler from '../../../databasehandler/categoryhandler';
import {Graph} from '../../../styles/colors';

export default class CategoryHorizontalBar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      categories: [],
    };

    this.categoryHanlder = new CategoryDBHandler();
  }

  fetchFromDatabase = () => {
    const date = this.props.date;
    const monthYear =
      (date.getMonth() + 1 < 10
        ? '0' + (date.getMonth() + 1)
        : date.getMonth() + 1) +
      '/' +
      date.getFullYear();
    this.categoryHanlder
      .getCategoryTotalByMonthYear(monthYear, this.props.type)
      .then((categories) => {
        this.setState({
          categories: categories,
        });
      });
  };

  componentDidMount() {
    this.fetchFromDatabase();
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.date != prevProps.date) {
      this.fetchFromDatabase();
    }
  }

  getData = () => {
    let dataSets = [];
    let values = [];

    if (this.state.categories.length != 0) {
      this.state.categories.forEach((category) => {
        values.push({y: category.total});
      });
    }

    dataSets.push({
      values: values,
      label: 'Bar dataSet',
      config: {
        color: processColor(
          this.props.type == 'income' ? Graph.income : Graph.expense,
        ),
        valueTextSize: 10,
        valueFormatter: '$#.##',
      },
    });

    return {
      dataSets: dataSets,
    };
  };

  getCategoryTitles = () => {
    let titles = [];

    this.state.categories.forEach((category) => {
      titles.push(category.title);
    });
    return titles;
  };

  openEntryList = (e) => {
    console.log(e.nativeEvent.x);
    if (e.nativeEvent.x == undefined) {
      return;
    }
    const temp = [
      {
        category: this.state.categories[e.nativeEvent.x],
        status: true,
      },
    ];

    let month =
      this.props.date.getMonth() + 1 < 10
        ? '0' + (this.props.date.getMonth() + 1)
        : this.props.date.getMonth() + 1;
    this.props.navigation.navigate('EntryList', {
      type: this.props.type,
      year: this.props.date.getFullYear(),
      month: month,
      categories: temp,
      searchText: '',
    });
  };

  render() {
    return (
      <View style={styles.chartContainer}>
        <BarChart
          style={{flex: 1}}
          legend={{
            enabled: false,
          }}
          data={this.getData()}
          xAxis={{
            valueFormatter: this.getCategoryTitles(),
            position: 'BOTTOM',
            granularityEnabled: true,
            granularity: 1,
            drawGridLines: false,
            labelCount: this.state.categories.length,
          }}
          marker={{
            enabled: false,
          }}
          yAxis={{
            left: {enabled: false},
            right: {enabled: false},
          }}
          highlightFullBarEnabled={false}
          // drawValueAboveBar={false}
          chartDescription={{
            text: '',
          }}
          animation={{
            durationY: 1000,
            durationX: 1000,
          }}
          onSelect={this.openEntryList}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  chartContainer: {
    flex: 1,
    // height: 300,
    // marginTop: 20,
    //   margin: 10,
    //   padding: 4,
    //   backgroundColor: 'white',
    //   borderRadius: 15
    paddingBottom: 5,
  },
});

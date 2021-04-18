import React, {Component} from 'react';
import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {ListColors} from '../../styles/colors';
import {getMonthName, getSelectedCategories} from '../../utils/converters';
import EntryDBHandler from '../../databasehandler/entryhandler';
import {dimensions} from '../../utils/constants';

export default class Year extends Component {
  constructor(props) {
    super(props);
    this.state = {
      months: [],
      amount: 0,
      selectedCats: this.props.categories,
    };

    this.entryHandler = new EntryDBHandler();
  }

  getYearData = (searchText, categories) => {
    this.entryHandler
      .getSearchMonthsOfYear(searchText, this.props.year, categories)
      .then((result) => {
        this.setState({
          months: result,
        });
      });
  };

  addToTotal = (amount) => {
    amount = parseFloat(amount);
    let total = this.state.amount;
    total += amount;
    this.setState({
      amount: total,
    });

    this.props.passTotal(amount);
  };

  componentDidMount() {
    this.getYearData(this.props.searchText, this.props.categories);
  }

  componentDidUpdate(prevProps, prevState) {
    let change = false;

    if (prevProps.searchText != this.props.searchText) {
      change = true;
    }
    if (prevProps.categories.length != this.state.selectedCats.length) {
      change = true;
    } else {
      for (let i = 0; i < prevProps.categories.length; i++) {
        if (prevProps.categories[i] != this.state.selectedCats[i]) {
          change = true;
          break;
        }
      }
    }

    if (change) {
      this.setState({
        selectedCats: prevProps.categories,
        amount: 0,
      });

      this.getYearData(this.props.searchText, prevProps.categories);
    }
  }
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>{this.props.year}</Text>
        <FlatList
          style={styles.listOfMonths}
          keyExtractor={(item) => item}
          data={this.state.months}
          renderItem={({item}) => {
            return (
              <Month
                passTotal={this.addToTotal}
                month={item}
                searchText={this.props.searchText}
                year={this.props.year}
                type={this.props.type}
                categories={this.state.selectedCats}
                navigation={this.props.navigation}
              />
            );
          }}
        />
        <Text style={styles.footer}>$ {this.state.amount.toFixed(2)}</Text>
      </View>
    );
  }
}

class Month extends Component {
  constructor(props) {
    super(props);
    this.state = {
      amount: 0,
      selectedCats: props.categories,
    };
    this.entryHandler = new EntryDBHandler();
  }

  getMonthTotal = (searchText, categories) => {
    let date = `${this.props.month}/${this.props.year}`;
    this.entryHandler
      .getSearchMonthTotal(searchText, date, categories)
      .then((total) => {
        this.setState({
          amount: total,
        });
        this.props.passTotal(total);
      });
  };
  componentDidMount() {
    this.getMonthTotal(this.props.searchText, this.props.categories);
  }

  componentDidUpdate(prevProps, prevState) {
    let change = false;
    if (prevProps.searchText != this.props.searchText) {
      change = true;
    } else if (prevProps.categories.length != this.state.selectedCats.length) {
      change = true;
    } else {
      for (let i = 0; i < prevProps.categories.length; i++) {
        if (prevProps.categories[i] != this.state.selectedCats[i]) {
          change = true;
          break;
        }
      }
    }

    if (change) {
      this.getMonthTotal(this.props.searchText, prevProps.categories);
      this.setState({
        selectedCats: prevProps.categories,
      });
    }
  }

  goToEntryListScreen = () => {
    this.props.navigation.navigate('EntryList', {
      type: this.props.type,
      year: this.props.year,
      month: this.props.month,
      categories: this.state.selectedCats,
    });
  };

  render() {
    return (
      <TouchableOpacity
        style={styles.monthContainer}
        onPress={this.goToEntryListScreen}>
        <Text style={styles.monthText}>{getMonthName(this.props.month)}</Text>
        <Text style={styles.amountText}> $ {this.state.amount.toFixed(2)}</Text>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 1,
    elevation: 1,
    marginBottom: 10,
  },
  title: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: ListColors.yearList.title,
    backgroundColor: ListColors.yearList.background,
    fontSize: dimensions.year.titleText,
  },
  footer: {
    textAlign: 'center',
    color: ListColors.yearList.title,
    backgroundColor: ListColors.yearList.footer,
    fontSize: dimensions.year.footerText,
  },
  listOfMonths: {
    marginHorizontal: 15,
    marginVertical: 5,
  },
  monthContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 4,
    marginHorizontal: 2,
  },
  monthText: {
    fontSize: dimensions.month.titleText,
    fontWeight: 'bold',
    flex: 2,
  },
  amountText: {
    flex: 1,
    fontSize: dimensions.month.totalText,
    textAlign: 'right',
  },
});

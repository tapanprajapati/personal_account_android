import React, {Component} from 'react';
import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {ListColors} from '../../styles/colors';
import {getMonthName, getSelectedCategories} from '../../utils/converters';
import EntryDBHandler from '../../databasehandler/entryhandler';
import {dimensions} from '../../utils/constants';
import {global} from '../../styles/global';
import {Animated} from 'react-native';

export default class Year extends Component {
  constructor(props) {
    super(props);
    this.state = {
      months: [],
      amount: 0,
      callToTotal: 0,
      selectedCats: getSelectedCategories(this.props.categories),
      posY: new Animated.Value(-50),
      tagPosX: new Animated.Value(-100),
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
      callToTotal: this.state.callToTotal + 1,
    });

    if (this.state.callToTotal + 1 == this.state.months.length) {
      this.props.doneLoading();
    }

    this.props.passTotal(amount);
  };

  componentDidMount() {
    this.getYearData(this.props.searchText, this.state.selectedCats);
    // this.unsubscribe = this.props.navigation.addListener(
    //   'focus',
    //   this.handleStateChange,
    // );

    // Animated.timing(this.state.posY,{
    //   toValue: 0,
    //   duration: 1000
    // }).start(()=>{})

    Animated.parallel([
      Animated.timing(this.state.tagPosX, {
        toValue: 0,
        useNativeDriver: true,
        duration: 1000,
      }),
      Animated.timing(this.state.posY, {
        toValue: 0,
        useNativeDriver: true,
        duration: 1000,
      }),
    ]).start();
    // this.getYearData(this.props.searchText, this.props.categories);
    // })
  }

  componentWillUnmount() {
    // this.unsubscribe();
  }

  handleStateChange = () => {
    console.log(`Refresh ${this.props.year}`);
    this.setState({
      amount: 0,
    });
    this.getYearData(this.props.searchText, this.state.selectedCats);
  };

  componentDidUpdate(prevProps, prevState) {
    let change = false;
    if (prevProps.edit) {
      change = true;
    }
    // else if (prevProps.searchText != this.props.searchText) {
    //   change = true;
    // }

    if (change) {
      this.setState({
        selectedCats: getSelectedCategories(prevProps.categories),
        amount: 0,
      });

      this.getYearData(
        this.props.searchText,
        getSelectedCategories(prevProps.categories),
      );
    }
  }
  render() {
    return (
      <Animated.View
        style={[
          styles.container,
          global.shadow,
          {transform: [{translateY: this.state.posY}]},
        ]}>
        <Animated.View
          style={[
            styles.titleContainer,
            {
              transform: [{translateX: this.state.tagPosX}],
            },
          ]}>
          <Text style={styles.title}>{this.props.year}</Text>
          <View style={styles.titleMaterialBack}></View>
        </Animated.View>
        <Animated.View
          style={[
            styles.titleShadowContainer,
            {
              transform: [{translateX: this.state.tagPosX}],
            },
          ]}>
          <View style={styles.titleMaterialBackShadow}></View>
        </Animated.View>
        <Text style={styles.footer}>$ {this.state.amount.toFixed(2)}</Text>
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
                edit={this.props.edit}
                categories={this.props.categories}
                navigation={this.props.navigation}
              />
            );
          }}
        />
      </Animated.View>
    );
  }
}

class Month extends Component {
  constructor(props) {
    super(props);
    this.state = {
      amount: 0,
      selectedCats: getSelectedCategories(props.categories),
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
    this.getMonthTotal(this.props.searchText, this.state.selectedCats);
    // this.unsubscribe = this.props.navigation.addListener(
    //   'focus',
    //   this.handleStateChange,
    // );
  }

  componentWillUnmount() {
    // this.unsubscribe();
  }

  componentDidUpdate(prevProps, prevState) {
    let change = false;
    if (prevProps.edit) {
      change = true;
    }
    // else if (prevProps.searchText != this.props.searchText) {
    //   change = true;
    // }

    if (change) {
      this.getMonthTotal(
        this.props.searchText,
        getSelectedCategories(prevProps.categories),
      );
      this.setState({
        selectedCats: getSelectedCategories(prevProps.categories),
      });
    }
  }

  goToEntryListScreen = () => {
    this.props.navigation.navigate('EntryList', {
      type: this.props.type,
      year: this.props.year,
      month: this.props.month,
      categories: this.props.categories,
      searchText: this.props.searchText,
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
    borderRadius: 2,
    marginBottom: 10,
    shadowColor: 'grey',
    marginHorizontal: 10,
  },
  title: {
    fontWeight: 'bold',
    marginHorizontal: 10,
    color: ListColors.yearList.title,
    fontSize: dimensions.year.titleText,
    flex: 1,
  },
  titleContainer: {
    position: 'absolute',
    zIndex: 2,
    // borderWidth: 1,
    // borderColor: 'black',
    // transform:[{rotateY: '80deg'}],
    width: 100,
    overflow: 'hidden',
    flexDirection: 'row',
    start: -10,
    top: 7,
  },
  titleShadowContainer: {
    position: 'absolute',
    zIndex: 1,
    overflow: 'hidden',
    width: 100,

    height: 35,
    start: 0,
    top: 11,
  },
  titleMaterialBack: {
    position: 'absolute',
    start: -15,
    top: -20,
    zIndex: -1,
    backgroundColor: 'orange',
    height: 100,
    width: 100,
    overflow: 'hidden',
    transform: [{rotate: '-30deg'}],
  },
  titleMaterialBackShadow: {
    position: 'absolute',
    start: -16,
    top: -20,
    zIndex: -2,
    backgroundColor: '#000',
    opacity: 0.5,
    height: 100,
    width: 100,
    overflow: 'hidden',
    transform: [{rotate: '-30deg'}],
  },
  footer: {
    textAlign: 'right',
    marginTop: 10,
    marginBottom: 5,
    marginHorizontal: 5,
    color: ListColors.yearList.footer,
    fontSize: dimensions.year.footerText,
    flex: 1,
  },
  listOfMonths: {
    paddingHorizontal: 5,
    paddingVertical: 2,
    backgroundColor: 'white',
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
    color: '#396884',
  },
  amountText: {
    flex: 1,
    fontSize: dimensions.month.totalText,
    textAlign: 'right',
  },
});

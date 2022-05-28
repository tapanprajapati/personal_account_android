import React, {Component} from 'react';
import {Text} from 'react-native';
import {Modal} from 'react-native';
import {FlatList} from 'react-native';
import {StyleSheet} from 'react-native';
import {RefreshControl} from 'react-native';
import {View} from 'react-native';
import {Icon, Tooltip} from 'react-native-elements';
import CategoryDBHandler from '../../databasehandler/categoryhandler';
import EntryDBHandler from '../../databasehandler/entryhandler';
import UserDBHandler from '../../databasehandler/userhandler';
import CategoryFilterModal from '../../modals/CategoryFilterModal';
import {TextBackground} from '../../styles/colors';
import {global} from '../../styles/global';
import {dimensions} from '../../utils/constants';
import {formatLargeNumber} from '../../utils/converters';
import YearDifference from './YearDifference';

export default class Difference extends Component {
  constructor(props) {
    super(props);
    this.entryHandler = new EntryDBHandler();
    this.categoryHandler = new CategoryDBHandler();
    this.userHandler = new UserDBHandler();

    this.state = {
      years: [],
      income: 0,
      expense: 0,
      edit: false,
      refresh: false,
      showIncomeFilter: false,
      showExpenseFilter: false,
      incomeCategories: [],
      expenseCategories: [],
      users: [],
      selectedUser: ""
    };
  }

  addToIncome = (amount) => {
    amount = parseFloat(amount);
    this.setState({
      income: this.state.income + amount,
    });
  };

  addToExpense = (amount) => {
    amount = parseFloat(amount);
    this.setState({
      expense: this.state.expense + amount,
    });
  };

  getYears = () => {
    this.setState({
      edit: false,
    });
    this.entryHandler.getYears().then((result) => {
      if(result.success)
      {
        const years = result.message
        console.log(years);
        this.setState({
          years: years,
          refresh: false,
        });
      }
      else
      {
        Alert.alert('ERROR', `${result.message.toUpperCase()}`, [
            {
              text: 'Close',  
            },
          ]);
      }
    });
  };

  getUsers = () => {
    this.userHandler.getAllUsers().then(result=>{
      if(result.success)
      {
        result.message.push({username: "ALL"})
        this.setState({users: result.message, selectedUser: "ALL"})
      }
      else
      {
        Alert.alert('ERROR', `${result.message.toUpperCase()}`, [
            {
              text: 'Close',  
            },
          ]);
      }
    })
  }

  getCategories = (type) => {
    this.categoryHandler.getCategories(type).then((result) => {
      if(result.success)
      {
        const categories = result.message;
        let temp = [];
  
        categories.forEach((category) => {
          temp.push({
            category: category,
            status: true,
          });
        });
  
        if (type == 'income') {
          this.setState({
            incomeCategories: temp,
          });
        } else {
          this.setState({
            expenseCategories: temp,
          });
        }
      }
      else
      {
        Alert.alert('ERROR', `${result.message.toUpperCase()}`, [
            {
              text: 'Close',  
            },
          ]);
      }
    });
  };

  componentDidMount() {
    this.getYears();
    this.getUsers();

    this.getCategories('income');
    this.getCategories('expense');
  }

  refresh = () => {
    this.setState({
      edit: true,
      income: 0,
      expense: 0,
      refresh: true,
    });

    this.getYears();

    // this.setState({
    //   edit: false,
    // });
  };

  saveIncomeCategories = (categories,user="ALL") => {
    console.log("CategoryModalClosed: "+user)
    this.setState({
      incomeCategories: categories,
      edit: true,
      income: 0,
      expense: 0,
      selectedUser: user
    });

    setTimeout(this.getYears, 10);
  };

  saveExpenseCategories = (categories,user="ALL") => {
    this.setState({
      expenseCategories: categories,
      edit: true,
      income: 0,
      expense: 0,
      selectedUser: user
    });

    setTimeout(this.getYears, 10);
  };

  render() {
    const difference = this.state.income - this.state.expense;

    let diffColor = TextBackground.savingGreen;
    if (difference < 0) {
      diffColor = TextBackground.savingRed;
    }
    return (
      <View style={styles.main}>
        <View style={styles.filterContainer}>
          <View style={styles.filterTab}>
            <Icon
              name="filter-outline"
              type="ionicon"
              raised
              color="steelblue"
              reverse
              onPress={() => this.setState({showIncomeFilter: true})}
              size={12}
            />
            <Text style={styles.filterTitle}>Income</Text>
          </View>
          <View style={styles.filterTab}>
            <Icon
              name="filter-outline"
              type="ionicon"
              raised
              color="steelblue"
              reverse
              onPress={() => this.setState({showExpenseFilter: true})}
              size={12}
            />
            <Text style={styles.filterTitle}>Expense</Text>
          </View>
        </View>
        <View style={styles.yearsContainer}>
          <RefreshControl
            refreshing={this.state.refresh}
            onRefresh={() => setTimeout(this.refresh, 100)}>
            <FlatList
              data={this.state.years}
              keyExtractor={(item) => item}
              renderItem={({item}) => {
                return (
                  <YearDifference
                    year={item}
                    incomeCategories={this.state.incomeCategories}
                    expenseCategories={this.state.expenseCategories}
                    addToIncome={this.addToIncome}
                    edit={this.state.edit}
                    selectedUser={this.state.selectedUser}
                    addToExpense={this.addToExpense}></YearDifference>
                );
              }}></FlatList>
          </RefreshControl>
        </View>
        <View style={[styles.total, global.shadow]}>
          <Text style={styles.totalTitle}>Total</Text>
          <Text style={styles.totalIncome}>
            $ {formatLargeNumber(this.state.income)}
          </Text>
          <Text style={styles.totalExpense}>
            $ {formatLargeNumber(this.state.expense)}
          </Text>
          <Text style={[styles.totalDifference, {color: diffColor}]}>
            $ {formatLargeNumber(difference)}
          </Text>
        </View>
        <Modal
          transparent={true}
          visible={this.state.showIncomeFilter}
          onRequestClose={() => this.setState({showIncomeFilter: false})}
          style={styles.categoryModal}>
          <CategoryFilterModal
            categories={this.state.incomeCategories}
            saveChanges={this.saveIncomeCategories}
            users={this.state.users}
            selectedUser={this.state.selectedUser}
            close={() => this.setState({showIncomeFilter: false})}
          />
        </Modal>
        <Modal
          transparent={true}
          visible={this.state.showExpenseFilter}
          onRequestClose={() => this.setState({showExpenseFilter: false})}
          style={styles.categoryModal}>
          <CategoryFilterModal
            categories={this.state.expenseCategories}
            saveChanges={this.saveExpenseCategories}
            users={this.state.users}
            selectedUser={this.state.selectedUser}
            close={() => this.setState({showExpenseFilter: false})}
          />
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  main: {
    height: '100%',
  },
  filterContainer: {
    flexDirection: 'row',
  },
  filterTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterTitle: {
    fontSize: 16,
  },
  yearsContainer: {
    marginHorizontal: 5,
    marginBottom: 90,
  },
  total: {
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row',
    marginVertical: 8,
    marginHorizontal: 8,
    backgroundColor: 'white',
    padding: 5,
  },
  totalTitle: {
    flex: 1,
    fontWeight: 'bold',
    // color: 'white',
    // textAlignVertical: 'center',
    fontSize: dimensions.difference.default,
    // backgroundColor: TextBackground.differenceTotal,
  },
  totalIncome: {
    flex: 1,
    // fontWeight: 'bold',
    // color: 'white',
    // textAlignVertical: 'center',
    fontSize: dimensions.difference.default,
    // backgroundColor: TextBackground.differenceTotal,
  },
  totalExpense: {
    flex: 1,
    // fontWeight: 'bold',
    // textAlignVertical: 'center',
    // color: 'white',
    fontSize: dimensions.difference.default,
    // backgroundColor: TextBackground.differenceTotal,
  },
  totalDifference: {
    flex: 1,
    // fontWeight: 'bold',
    textAlignVertical: 'center',
    // color: 'white',
    fontSize: dimensions.difference.default,
  },
});

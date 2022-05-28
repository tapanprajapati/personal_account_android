import React, {Component} from 'react';
import {StyleSheet} from 'react-native';
import {Text, View, TouchableOpacity} from 'react-native';
import TypePieChart from '../components/graph/DashboardComponents/TypePieChart';
import {global} from '../styles/global';
import {getMonthName} from '../utils/converters';
import MonthYearPicker from '../modals/MonthYearPicker';
import DashboardCategoryTotal from '../components/DashboardCategoryTotal';
import CategoryDBHandler from '../databasehandler/categoryhandler';
import { Icon } from 'react-native-elements';
import { HeaderColors } from '../styles/colors';

export default class DashboardScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      date: new Date(),
      isDatePickerVisible: false,
      incomeData: [],
      incomeYTD: [],
      expenseYTD: [],
      expenseData: [],
      incomeTotal: 0,
      expenseTotal: 0
    };

    this.categoryHandler = new CategoryDBHandler();
  }

  saveDate = (date) => {
    this.setState({
      date: date,
    });
    setTimeout(()=>{

    this.getCategoryData("income")
    this.getCategoryData("expense")

    // this.getTypeTotal("income")
    // this.getTypeTotal("expense")
    },100)
  };

  getCategoryData = (type) => {
    const monthYear =
      (this.state.date.getMonth() + 1 < 10
        ? '0' + (this.state.date.getMonth() + 1)
        : this.state.date.getMonth() + 1) +
      '/' +
      this.state.date.getFullYear();
    this.categoryHandler.getAllCategoriesTotalMonth(type,monthYear).then(result=>{
      if(result.success)
      {
        const data = result.message
        const t = this.getTypeTotal(data)
        if(type==="income")
        {
          this.setState({
            incomeData: data,
            incomeTotal: t
          })
        }
        else{
          {
            this.setState({
              expenseData: data,
              expenseTotal: t
            })
          }
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
    })

    this.categoryHandler.getAllCategoriesTotalYear(type,this.state.date.getFullYear()).then(result=>{
      if(result.success)
      {
        const data = result.message
        if(type==="income")
        {
          this.setState({
            incomeYTD: data,
          })
        }
        else{
          {
            this.setState({
              expenseYTD: data,
            })
          }
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
    })
  }

  getTypeTotal = (data) => {
    let total = 0;
    data.forEach((item)=>{
        total+=item.total;
    })

    return total;
  }

  componentDidMount() {
    this.getCategoryData("income")
    this.getCategoryData("expense")
    // this.getTypeTotal("income")
    // this.getTypeTotal("expense")
  }

  refresh = () => {
    this.saveDate(this.state.date)
  }

  render() {
    return (
      <View style={global.container}>
        <View style={[styles.refreshContainer, global.shadow]}>
        <Icon
          containerStyle={styles.refreshIcon}
          name="refresh"
          type="material"
          color= {HeaderColors.background}
          onPress={this.refresh}
        />
        </View>
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
            <TypePieChart income={this.state.incomeTotal} expense={this.state.expenseTotal} />
          </View>
        </View>
        <View style={styles.categoryContainer}>
          <View style={[styles.categoryTotal, global.shadow]}>
            <DashboardCategoryTotal
              type={"Income"}
              data={this.state.incomeData}
              YTD={this.state.incomeYTD}
            />
          </View>

          <View style={[styles.categoryTotal, global.shadow]}>
            <DashboardCategoryTotal
              type={"Expense"}
              data={this.state.expenseData}
              YTD={this.state.expenseYTD}
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
    zIndex: -1
  },

  categoryContainer: {
    flex: 1,
    // flexDirection: 'row',
  },
  categoryTotal: {
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
  refreshContainer: {
    position: 'absolute',
    height: 30,
    width: 30,
    top: 10,
    right: 10,
    borderRadius: 5,
    backgroundColor: 'white'
  }
});

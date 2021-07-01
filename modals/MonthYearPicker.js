import React, {Component} from 'react';
import {StyleSheet} from 'react-native';
import {Modal, View, Text} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {FlatList} from 'react-native';
import {global} from '../styles/global';
import {getMonthName} from '../utils/converters';
import {TouchableOpacity} from 'react-native';
import {Icon} from 'react-native-elements';

const H = 30;

export default class MonthYearPicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      years: this.getYears(),
      months: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
      selectedMonth: this.props.date.getMonth(),
      selectedYear:
        20 + (this.props.date.getFullYear() - new Date().getFullYear()),
    };

    this._monthListRef = null;
    this.yearListRef = null;
  }

  scrollMonthHandler = (e) => {
    const y = parseInt(e.nativeEvent.contentOffset.y);
    const index = parseInt(y / H);
    const offSet = parseInt(y % H);

    if (offSet > 11) {
      this._monthListRef.scrollToIndex({index: index + 1, animated: true});
      this.setState({
        selectedMonth: index + 1,
      });
    } else {
      this._monthListRef.scrollToIndex({index: index, animated: true});
      this.setState({
        selectedMonth: index,
      });
    }
  };
  scrollYearHandler = (e) => {
    const y = parseInt(e.nativeEvent.contentOffset.y);
    const index = parseInt(y / H);
    const offSet = parseInt(y % H);

    if (offSet > 11) {
      this._yearListRef.scrollToIndex({index: index + 1, animated: true});
      this.setState({
        selectedYear: index + 1,
      });
    } else {
      this._yearListRef.scrollToIndex({index: index, animated: true});
      this.setState({
        selectedYear: index,
      });
    }
  };

  getYears = () => {
    const current = new Date().getFullYear();
    let years = [];

    for (let i = current - 20; i <= current + 20; i++) {
      years.push(i);
    }
    return years;
  };

  saveDate = () => {
    const year = this.state.selectedYear - 20 + new Date().getFullYear();
    const month = this.state.selectedMonth;

    this.props.saveDate(new Date(year, month, 1));

    this.props.close();
  };

  reset = () => {
    const month = new Date().getMonth();
    const year = 20;
    this.setState({
      selectedMonth: month,
      selectedYear: year,
    });

    this._monthListRef.scrollToIndex({index: month, animated: true});
    this._yearListRef.scrollToIndex({index: year, animated: true});
  };

  render() {
    return (
      <Modal visible={this.props.isVisible} transparent={true}>
        <View
          style={{
            backgroundColor: 'white',
            height: '100%',
            top: 0,
            left: 0,
            width: '100%',
            opacity: 0.6,
            position: 'absolute',
          }}></View>
        <View style={styles.container}>
          <View style={styles.outerContainer}>
            <View style={[styles.innerContainer, global.shadow]}>
              <Text style={styles.title}>Select Month and Date</Text>
              <View style={styles.dateHolder}>
                <View style={styles.listHolder}>
                  <Icon name="arrow-drop-up" type="material" />
                  <FlatList
                    ref={(ref) => {
                      this._monthListRef = ref;
                    }}
                    style={styles.listContainer}
                    data={this.state.months}
                    initialScrollIndex={this.state.selectedMonth}
                    getItemLayout={(data, index) => ({
                      length: H,
                      offset: H * index,
                      index,
                    })}
                    showsVerticalScrollIndicator={false}
                    onScrollEndDrag={this.scrollMonthHandler}
                    keyExtractor={(item) => item.toString()}
                    renderItem={({item}) => {
                      return (
                        <Text style={styles.list}>
                          {getMonthName(item + 1)}
                        </Text>
                      );
                    }}></FlatList>

                  <Icon name="arrow-drop-down" type="material" />
                </View>
                <View style={styles.listHolder}>
                  <Icon name="arrow-drop-up" type="material" />
                  <FlatList
                    ref={(ref) => {
                      this._yearListRef = ref;
                    }}
                    style={styles.listContainer}
                    data={this.state.years}
                    initialScrollIndex={this.state.selectedYear}
                    getItemLayout={(data, index) => ({
                      length: H,
                      offset: H * index,
                      index,
                    })}
                    showsVerticalScrollIndicator={false}
                    onScrollEndDrag={this.scrollYearHandler}
                    keyExtractor={(item) => item.toString()}
                    renderItem={({item}) => {
                      return <Text style={styles.list}>{item}</Text>;
                    }}></FlatList>

                  <Icon name="arrow-drop-down" type="material" />
                </View>
              </View>
              <View style={styles.actionButtonsContainer}>
                <TouchableOpacity onPress={this.reset}>
                  <Text style={styles.actionButton}>RESET</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={this.props.close}>
                  <Text style={styles.actionButton}>CANCEL</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={this.saveDate}>
                  <Text style={styles.actionButton}>OK</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  outerContainer: {
    backgroundColor: '#aaa',
    margin: 50,
  },
  innerContainer: {
    backgroundColor: 'white',
    position: 'relative',
    top: -5,
    left: -5,
  },
  title: {
    textAlign: 'center',
    padding: 15,
    backgroundColor: '#009688',
    fontSize: 22,
    color: 'white',
    fontWeight: 'bold',
  },
  dateHolder: {
    flexDirection: 'row',
    margin: 20,
    marginVertical: 20,
  },
  listHolder: {
    flexDirection: 'column',
    flex: 1,
    height: 80,
  },
  listContainer: {
    height: H,
    flex: 1,
  },

  list: {
    height: H,
    fontSize: 25,
    fontWeight: 'bold',
    color: 'orange',
    alignSelf: 'center',
    width: '100%',
    textAlign: 'center',
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 10,
  },
  actionButton: {
    margin: 5,
    fontWeight: 'bold',
    minWidth: 50,
    textAlign: 'center',
  },
});

import React, {Component} from 'react';
import {StyleSheet, View} from 'react-native';
import {Button, Icon} from 'react-native-elements';
import checkAndCreateDatabase from '../../databasehandler/dbinit';
import EntryDBHandler from '../../databasehandler/entryhandler';
import {ButtonColors} from '../../styles/colors';
import {global} from '../../styles/global';
import HomeButton from './HomeButton';

class Home extends Component {
  constructor(props) {
    super(props);
    this.entryHandler = new EntryDBHandler();
    this.state = {
      expenseTotal: 0,
      incomeTotal: 0,
    };
  }

  getTotal = () => {
    this.entryHandler.getCategoryTotal('income').then((total) => {
      this.setState({
        incomeTotal: total,
      });
    });
    this.entryHandler.getCategoryTotal('expense').then((total) => {
      this.setState({
        expenseTotal: total,
      });
    });
  };

  componentDidMount() {
    this.props.navigation.setOptions({
      headerRight: () => (
        <Icon
          containerStyle={{marginRight: 10}}
          name="devices"
          type="material"
          color="white"
          onPress={() => {
            this.props.navigation.navigate('RemoteConnection');
          }}
        />
      ),
    });
    checkAndCreateDatabase();
    this.getTotal();
  }
  render() {
    return (
      <View style={[global.container, styles.center]}>
        <View style={styles.buttonContainer}>
          <HomeButton
            color={ButtonColors.homeButton.income}
            title="INCOME"
            total={this.state.incomeTotal}
            onPress={() =>
              this.props.navigation.navigate('AccountType', {type: 'Income'})
            }
          />
          <HomeButton
            color={ButtonColors.homeButton.expense}
            title="EXPENSE"
            total={this.state.expenseTotal}
            onPress={() =>
              this.props.navigation.navigate('AccountType', {type: 'Expense'})
            }
          />
          <HomeButton
            color={ButtonColors.homeButton.difference}
            title="DIFFERENCE"
            total={this.state.incomeTotal - this.state.expenseTotal}
          />
        </View>

        <View style={global.floatingButton}>
          <Icon
            raised
            name="settings"
            type="material"
            color={ButtonColors.homeButton.floating}
            reverse
          />
        </View>
      </View>
    );
  }
}

export default Home;

const styles = StyleSheet.create({
  center: {
    justifyContent: 'space-around',
  },
  floating: {
    backgroundColor: ButtonColors.homeButton.floating,
  },
  buttonContainer: {
    height: '60%',
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
});

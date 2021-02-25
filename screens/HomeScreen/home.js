import React, {Component} from 'react';
import {StyleSheet, View} from 'react-native';
import {Button, Icon} from 'react-native-elements';
import {ButtonColors} from '../../styles/colors';
import {global} from '../../styles/global';
import HomeButton from './HomeButton';

class Home extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={[global.container, styles.center]}>
        <View style={styles.buttonContainer}>
          <HomeButton
            color={ButtonColors.homeButton.income}
            title="INCOME"
            total={50}
            onPress={() =>
              this.props.navigation.navigate('AccountType', {type: 'Income'})
            }
          />
          <HomeButton
            color={ButtonColors.homeButton.expense}
            title="EXPENSE"
            total={50}
            onPress={() =>
              this.props.navigation.navigate('AccountType', {type: 'Expense'})
            }
          />
          <HomeButton
            color={ButtonColors.homeButton.difference}
            title="DIFFERENCE"
            total={50}
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

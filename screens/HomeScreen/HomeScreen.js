import React, {Component} from 'react';
import {StyleSheet, View} from 'react-native';
import {Icon} from 'react-native-elements';
import checkAndCreateDatabase from '../../databasehandler/dbinit';
import EntryDBHandler from '../../databasehandler/entryhandler';
import {ButtonColors} from '../../styles/colors';
import {global} from '../../styles/global';
import HomeButton from './HomeButton';
import ActionButton from 'react-native-action-button';
// import RNFileSelector from 'react-native-file-selector';
import BackupHandler from '../../backupmanager/BackupHandler';
import DocumentPicker from 'react-native-document-picker';
import RNFS from 'react-native-fs';

class Home extends Component {
  constructor(props) {
    super(props);
    this.entryHandler = new EntryDBHandler();
    this.state = {
      expenseTotal: 0,
      incomeTotal: 0,
    };

    this.backupHandler = new BackupHandler();
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

  showFab = (active) => {
    const color = 'white';
    if (!active) {
      return <Icon color={color} type="material" name="more-horiz" />;
    }

    return <Icon color={color} type="material" name="add" />;
  };

  read = (path) => {
    this.backupHandler.importData(path);
  };

  openPicker = () => {
    DocumentPicker.pick().then((res) => {
      this.backupHandler.importData(res.uri);
    });
  };
  render() {
    return (
      <View style={[global.container, styles.center]}>
        <View style={styles.buttonContainer}>
          <HomeButton
            color={ButtonColors.homeButton.income}
            title="INCOME"
            total={`Total: $ ${this.state.incomeTotal}`}
            onPress={() =>
              this.props.navigation.navigate('AccountType', {type: 'Income'})
            }
          />
          <HomeButton
            color={ButtonColors.homeButton.expense}
            title="EXPENSE"
            total={`Total: $ ${this.state.expenseTotal}`}
            onPress={() =>
              this.props.navigation.navigate('AccountType', {type: 'Expense'})
            }
          />
          <HomeButton
            color={ButtonColors.homeButton.difference}
            title="DIFFERENCE"
            total={`Total: $ ${(
              this.state.incomeTotal - this.state.expenseTotal
            ).toFixed(2)}`}
          />

          <HomeButton
            color={ButtonColors.homeButton.recent}
            title="RECENT"
            total="50 Entries"
            onPress={() => this.props.navigation.navigate('RecentEntries')}
          />
        </View>

        {/* <View> */}
        <ActionButton
          style={[styles.floating]}
          buttonColor={ButtonColors.homeButton.floating}
          renderIcon={this.showFab}
          useNativeFeedback={false}>
          <ActionButton.Item
            title="Import"
            style={styles.floating}
            onPress={() => {
              // this.setState({visible: true, fileSystemMode: 'i'});
              console.log('Import Pressed');
              this.openPicker();
            }}
            buttonColor={ButtonColors.homeButton.import}>
            <Icon type="material" name="file-download"></Icon>
          </ActionButton.Item>
          <ActionButton.Item
            title="Export"
            style={styles.floating}
            onPress={() => {
              // this.setState({visible: true, fileSystemMode: 'e'});
              console.log('Export Pressed');
            }}
            buttonColor={ButtonColors.homeButton.export}>
            <Icon type="material" name="file-upload"></Icon>
          </ActionButton.Item>
        </ActionButton>
        {/* </View> */}

        {/* <RNFileSelector
          title={'Select File'}
          visible={this.state.visible}
          onDone={(path) => {
            console.log('file selected: ' + path);
            if (this.state.fileSystemMode == 'i') {
              this.read(path);
            }
          }}
          onCancel={() => {
            console.log('cancelled');
          }}
        /> */}
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
    elevation: 4,
    zIndex: 0,
  },
  buttonContainer: {
    zIndex: 0,
    height: '80%',
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
});

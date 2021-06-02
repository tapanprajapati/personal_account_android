import React, {Component} from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';
import {ListColors} from '../styles/colors';
import EntryDBHandler from '../databasehandler/entryhandler';
import Entry from './Entry';
import {dimensions} from '../utils/constants';
import {global} from '../styles/global';

export default class Date extends Component {
  constructor(props) {
    super(props);
    this.state = {
      entries: [],
      amount: 0,
      edit: false,
    };

    this.entryHandler = new EntryDBHandler();
  }

  getEntries = (searchText = '') => {
    let date = `${this.props.date}/${this.props.month}/${this.props.year}`;
    this.entryHandler
      .getSearchEntriesByDate(searchText, date, this.props.categories)
      .then((result) => {
        this.setState({
          entries: result,
        });
        this.getTotal(result);
      });
  };

  markEdit = () => {
    this.setState({
      edit: true,
    });
  };

  getTotal = (entries) => {
    let total = 0;
    entries.forEach((entry) => {
      total += entry.amount;
    });

    this.setState({
      amount: total,
    });
  };

  componentDidMount() {
    this.getEntries(this.props.searchText);
    // this.unsubscribe = this.props.navigation.addListener('focus', () => {
    //   if (this.state.edit) {
    //     this.setState({
    //       edit: false,
    //       amount: 0,
    //     });
    //     this.getEntries();
    //     console.log(
    //       `Edit ${this.props.date}/${this.props.month}/${this.props.year}`,
    //     );
    //   }
    // });
  }
  componentWillUnmount() {
    // this.unsubscribe();
  }
  componentDidUpdate(prevProps, prevState) {
    let change = false;
    // if (prevProps.searchText != this.props.searchText) {
    //   change = true;
    // } else
    if (prevProps.edit) {
      change = true;
    }

    if (change) {
      this.getEntries(this.props.searchText);
    }
  }
  render() {
    return (
      <View style={[styles.container, global.shadow]}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{this.props.date}</Text>
          <View style={styles.titleMaterialBack}></View>
        </View>
        <View style={styles.titleShadowContainer}>
          <View style={styles.titleMaterialBackShadow}></View>
        </View>
        <Text style={styles.footer}>$ {this.state.amount.toFixed(2)}</Text>
        <FlatList
          style={styles.listOfEntries}
          keyExtractor={(item) => `${item.id}`}
          data={this.state.entries}
          renderItem={({item}) => {
            return (
              <Entry
                navigation={this.props.navigation}
                entry={item}
                markDateEdit={this.markEdit}
                refresh={this.getEntries}
              />
            );
          }}
        />
        {/* <Text style={styles.footer}>$ {this.state.amount.toFixed(2)}</Text> */}
      </View>
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
    width: '104%',
    overflow: 'hidden',
    flexDirection: 'row',
    start: -10,
    top: 7,
  },
  titleShadowContainer: {
    position: 'absolute',
    zIndex: 1,
    overflow: 'hidden',

    width: '100%',
    height: 35,
    start: 0,
    top: 11,
  },
  titleMaterialBack: {
    position: 'absolute',
    start: -40,
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
    start: -42,
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
  listOfEntries: {
    marginHorizontal: 10,
    marginVertical: 5,
  },
});

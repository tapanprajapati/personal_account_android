import React, {Component} from 'react';
import {StyleSheet} from 'react-native';
import {FlatList, View} from 'react-native';
import {SearchBar} from 'react-native-elements';
import EntryDBHandler from '../databasehandler/entryhandler';
import {global} from '../styles/global';
import Date from './Lists/Date';

export default class EntryList extends Component {
  constructor(props) {
    super(props);
    this.entryHandler = new EntryDBHandler();
    this.state = {
      dates: [],
      searchText: '',
    };
  }

  getDates = (searchText = '') => {
    let date = `${this.props.route.params.month}/${this.props.route.params.year}`;
    this.entryHandler
      .getSearchDatesFromMonthAndYear(
        searchText,
        date,
        this.props.route.params.categories,
      )
      .then((dates) => {
        this.setState({
          dates: dates,
        });
      });
  };

  componentDidMount() {
    this.getDates();
  }

  handleSearch = (text) => {
    this.setState({
      searchText: text,
    });

    this.getDates(text);
  };

  render() {
    return (
      <View style={global.container}>
        <SearchBar
          containerStyle={styles.searchBarContainer}
          placeholder="Type Here..."
          inputContainerStyle={styles.searchBarInputContainer}
          onChangeText={this.handleSearch}
          value={this.state.searchText}
          onClear={() => this.handleSearch('')}
        />
        <FlatList
          style={global.list}
          data={this.state.dates}
          keyExtractor={(item) => item}
          renderItem={({item}) => {
            return (
              <Date
                navigation={this.props.navigation}
                date={item}
                searchText={this.state.searchText}
                month={this.props.route.params.month}
                year={this.props.route.params.year}
                categories={this.props.route.params.categories}
              />
            );
          }}></FlatList>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  searchBarContainer: {
    backgroundColor: 'white',
    borderTopWidth: 0,
    padding: 0,
    borderBottomWidth: 0,
  },
  searchBarInputContainer: {
    backgroundColor: 'white',
    elevation: 3,
    opacity: 1,
    marginBottom: 10,
    borderRadius: 55,
  },
});

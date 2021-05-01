import React, {Component} from 'react';
import { Modal } from 'react-native';
import {StyleSheet} from 'react-native';
import {FlatList, View} from 'react-native';
import {Icon, SearchBar} from 'react-native-elements';
import EntryDBHandler from '../databasehandler/entryhandler';
import {global} from '../styles/global';
import { getSelectedCategories } from '../utils/converters';
import CategoryFilterModal from './CategoryFilterModal';
import Date from './Lists/Date';

export default class EntryList extends Component {
  constructor(props) {
    super(props);
    this.entryHandler = new EntryDBHandler();
    this.state = {
      dates: [],
      searchText: '',
      selectedCategories: getSelectedCategories(this.props.route.params.categories),
      showCategoryModal: false,
      edit: false
    };
  }

  getDates = (searchText = '',categories = '') => {
    console.log(categories)
    if(categories=='')
      categories = this.state.selectedCategories
    let date = `${this.props.route.params.month}/${this.props.route.params.year}`;
    this.entryHandler
      .getSearchDatesFromMonthAndYear(
        searchText,
        date,
        categories
      )
      .then((dates) => {
        this.setState({
          dates: dates,
          edit: false
        });
      });
  };

  componentDidMount() {
    this.props.navigation.setOptions({
      headerRight: () => (
        <Icon
          containerStyle={{marginRight: 10}}
          name="filter-outline"
          type="ionicon"
          color="white"
          onPress={() => {
            this.setState({showCategoryModal: true});
          }}
        />
      ),
    });
    this.getDates();
  }

  handleSearch = (text) => {
    this.setState({
      searchText: text,
      edit: true
    });

    this.getDates(text);
  };

  saveCategories = (categories) => {
    const cats = getSelectedCategories(categories)
    this.setState({
      selectedCategories: cats,
      edit: true
    });
    this.getDates(this.state.searchText,cats);
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
                categories={this.state.selectedCategories}
                edit={this.state.edit}
              />
            );
          }}></FlatList>

          <Modal
            transparent={true}
            visible={this.state.showCategoryModal}
            onRequestClose={() => this.setState({showCategoryModal: false})}
            style={styles.categoryModal}>
            <CategoryFilterModal
              categories={this.props.route.params.categories}
              saveChanges={this.saveCategories}
              close={() => this.setState({showCategoryModal: false})}
            />
          </Modal>
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

import React, {Component} from 'react';
import {FlatList, Modal, StyleSheet, Text, View} from 'react-native';
import {Icon, SearchBar} from 'react-native-elements';
import CategoryDBHandler from '../databasehandler/categoryhandler';
import EntryDBHandler from '../databasehandler/entryhandler';
import {ButtonColors, TextBackground} from '../styles/colors';
import {global} from '../styles/global';
import {dimensions} from '../utils/constants';
import {getSelectedCategories} from '../utils/converters';
import CategoryFilterModal from './CategoryFilterModal';
import Year from './Lists/Year';

export default class AccountType extends Component {
  constructor(props) {
    super(props);
    this.state = {
      years: [],
      showCategoryModal: false,
      categories: [],
      total: 0,
      searchText: '',
      edit: false
    };
    this.entryHandler = new EntryDBHandler();
    this.categoryHandler = new CategoryDBHandler();
  }

  getYears = (searchText = '') => {
    const categoryString = getSelectedCategories(this.state.categories).join(
      ',',
    );
    this.entryHandler
      .getSearchYears(searchText, categoryString)
      .then((years) => {
        this.setState({
          years: years,
          edit: false
        });
      });
  };

  addToTotal = (amount) => {
    // amount = parseFloat(amount);
    this.setState({
      total: this.state.total + amount,
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

    this.categoryHandler
      .getCategories(this.props.route.params.type.toLowerCase())
      .then((result) => {
        let tempCategories = [];
        result.forEach((category) => {
          tempCategories.push({
            category: category,
            status: true,
          });
        });

        this.setState({
          categories: tempCategories,
        });

        this.getYears(this.state.searchText);
      });

    this.unsubscribe = this.props.navigation.addListener(
      'focus',
      this.handleStateChange,
    );
  }

  componentWillUnmount() {
    this.unsubscribe();
    console.log('Unmounted');
  }

  handleStateChange = () => {
    if(this.state.edit)
    {
      this.getYears(this.state.searchText);
      this.setState({
        total: 0,
      });
      console.log('Refresh');

      this.setState({
        edit: false
      })
    }
  };

  saveCategories = (categories) => {
    this.setState({
      categories: categories,
      total: 0,
      edit: true
    });
    this.getYears();
  };

  handleSearch = (text) => {
    this.setState({
      searchText: text,
      total: 0,
      edit: true
    });

    this.getYears(text);
  };
  render() {
    return (
      <View style={global.container}>
        <View>

        <SearchBar
          containerStyle={styles.searchBarContainer}
          placeholder="Type Here..."
          inputContainerStyle={styles.searchBarInputContainer}
          onChangeText={this.handleSearch}
          value={this.state.searchText}
          onClear={() => this.handleSearch('')}
        />
        <Icon
          containerStyle={{position: 'absolute',end: 0,margin: 0,top: -2}}
          name="filter-outline"
          type="ionicon"
          raised
          color="steelblue"
          // reverse
          onPress={() => {
            this.setState({showCategoryModal: true});
          }}
        />
        </View>
        <FlatList
          extraData={this.state.categories}
          style={[global.list, styles.yearListContainer]}
          data={this.state.years}
          keyExtractor={(item) => {
            return item;
          }}
          renderItem={({item}) => {
            return (
              <Year
                type={this.props.route.params.type}
                key={item}
                year={item}
                edit={this.state.edit}
                categories={(this.state.categories)}
                navigation={this.props.navigation}
                passTotal={this.addToTotal}
                searchText={this.state.searchText}
              />
            );
          }}
        />
        <Text style={styles.footer}>
          Total: $ {this.state.total.toFixed(2)}
        </Text>
        <View style={global.floatingButton}>
          <Icon
            raised
            color={ButtonColors.floatingAdd}
            name="add"
            type="material"
            reverse
            onPress={() =>{

              this.props.navigation.navigate('AddEntry', {
                type: this.props.route.params.type,
              })

              this.setState({
                edit:true
              })
            }
            }
          />
        </View>
        <Modal
          transparent={true}
          visible={this.state.showCategoryModal}
          onRequestClose={() => this.setState({showCategoryModal: false})}
          style={styles.categoryModal}>
          <CategoryFilterModal
            categories={this.state.categories}
            saveChanges={this.saveCategories}
            close={() => this.setState({showCategoryModal: false})}
          />
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  footer: {
    width: '100%',
    textAlign: 'center',
    backgroundColor: TextBackground.footerTotal,
    color: 'white',
    fontSize: dimensions.accountType.footerText,
    fontWeight: 'bold',
  },
  searchBarContainer: {
    backgroundColor: 'white',
    borderTopWidth: 0,
    padding: 0,
    borderBottomWidth: 0,
    marginEnd: 60
  },
  searchBarInputContainer: {
    backgroundColor: 'white',
    elevation: 3,
    opacity: 1,
    marginBottom: 10,
    borderRadius: 55,
  },
  yearListContainer: {
    marginBottom: 8,
  },
});

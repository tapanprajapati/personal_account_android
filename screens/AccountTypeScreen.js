import React, {Component} from 'react';
import {RefreshControl} from 'react-native';
import {FlatList, Modal, StyleSheet, Text, View} from 'react-native';
import {Icon, SearchBar} from 'react-native-elements';
import Year from '../components/Year';
import CategoryDBHandler from '../databasehandler/categoryhandler';
import EntryDBHandler from '../databasehandler/entryhandler';
import CategoryFilterModal from '../modals/CategoryFilterModal';
import LoadingSpinner from '../modals/LoadingSpinner';
import {ButtonColors} from '../styles/colors';
import {global} from '../styles/global';
import {getSelectedCategories} from '../utils/converters';

export default class AccountType extends Component {
  constructor(props) {
    super(props);
    this.state = {
      years: [],
      showCategoryModal: false,
      categories: [],
      total: 0,
      searchText: '',
      countDoneLoading: 0,
      edit: false,
      refresh: false,
      isLoading: true,
    };
    this.entryHandler = new EntryDBHandler();
    this.categoryHandler = new CategoryDBHandler();
  }

  getYears = (searchText = this.state.searchText) => {
    const categoryString = getSelectedCategories(this.state.categories).join(
      ',',
    );

    this.setState({
      edit: false,
      total: 0,
      isLoading: true,
      countDoneLoading: 0,
    });
    this.entryHandler
      .getSearchYears(searchText, categoryString)
      .then((years) => {
        this.setState({
          years: years,
          refresh: false,
        });

        setTimeout(() => {
          this.setState({
            isLoading: false,
          });
        }, 1500);
      });
  };

  addToTotal = (amount) => {
    // amount = parseFloat(amount);
    this.setState({
      total: this.state.total + amount,
    });
  };

  doneLoading = () => {
    this.setState({
      countDoneLoading: this.state.countDoneLoading + 1,
    });

    if (this.state.countDoneLoading == this.state.years.length) {
      this.setState({isLoading: false});
    }
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
    if (this.state.edit) {
      this.getYears(this.state.searchText);

      console.log('Refresh');
    }
  };

  saveCategories = (categories) => {
    this.setState({
      categories: categories,
      edit: true,
    });

    setTimeout(this.getYears, 10);
  };

  handleSearch = () => {
    this.setState({
      // searchText: text,
      edit: true,
    });

    setTimeout(this.getYears, 10);
    console.log(`Searching: ${this.state.searchText}`);
    // console.log(text);
  };

  refresh = () => {
    this.setState({
      edit: true,
      refresh: true,
    });
    this.getYears(this.state.searchText);
  };
  render() {
    return (
      <View style={global.container}>
        <View>
          <SearchBar
            containerStyle={styles.searchBarContainer}
            placeholder="Search Here..."
            inputContainerStyle={styles.searchBarInputContainer}
            onChangeText={(text) => {
              this.setState({searchText: text});
            }}
            value={this.state.searchText}
            onClear={this.handleSearch}
            onSubmitEditing={this.handleSearch}
          />
          <Icon
            containerStyle={{position: 'absolute', end: 60, margin: 0, top: -2}}
            name="filter-outline"
            type="ionicon"
            raised
            color="steelblue"
            // reverse
            onPress={() => {
              this.setState({showCategoryModal: true});
            }}
          />
          <Icon
            containerStyle={{position: 'absolute', end: 0, margin: 0, top: -2}}
            raised
            color={ButtonColors.floatingAdd}
            name="add"
            type="material"
            onPress={() => {
              this.props.navigation.navigate('AddEntry', {
                type: this.props.route.params.type,
              });

              this.setState({
                edit: true,
              });
            }}
          />
        </View>
        <RefreshControl
          style={[global.list, styles.yearListContainer]}
          refreshing={this.state.refresh}
          onRefresh={() => {
            setTimeout(this.refresh, 100);
          }}>
          <FlatList
            // style={[global.list]}
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
                  categories={this.state.categories}
                  navigation={this.props.navigation}
                  passTotal={this.addToTotal}
                  searchText={this.state.searchText}
                  doneLoading={this.doneLoading}
                />
              );
            }}
          />
        </RefreshControl>
        <Text style={global.footer}>
          Total: $ {this.state.total.toFixed(2)}
        </Text>
        {/* <View style={global.floatingButton}>
          
        </View> */}
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
        <LoadingSpinner isLoading={this.state.isLoading} />
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
    marginEnd: 120,
  },
  searchBarInputContainer: {
    backgroundColor: 'white',
    elevation: 3,
    opacity: 1,
    marginBottom: 10,
    borderRadius: 55,
  },
  yearListContainer: {
    marginBottom: 80,
  },
});

import React, {Component} from 'react';
import {Text} from 'react-native';
import {Modal} from 'react-native';
import {StyleSheet} from 'react-native';
import {FlatList, View} from 'react-native';
import {Icon, SearchBar} from 'react-native-elements';
import Date from '../components/Date';
import EntryDBHandler from '../databasehandler/entryhandler';
import CategoryFilterModal from '../modals/CategoryFilterModal';
import {global} from '../styles/global';
import {getSelectedCategories} from '../utils/converters';
import CameraImagePreviewModal from '../modals/CameraImagePreviewModal';
import CameraImageHandler from '../databasehandler/cameraImageHandler';

export default class EntryList extends Component {
  constructor(props) {
    super(props);
    this.entryHandler = new EntryDBHandler();
    this.cameraImageHandler = new CameraImageHandler();
    this.state = {
      dates: [],
      searchText: this.props.route.params.searchText,
      selectedCategories: getSelectedCategories(
        this.props.route.params.categories,
      ),
      showCategoryModal: false,
      edit: false,
      total: 0,
      imagePath: '',
      showImage: false,
    };
  }

  getDates = (searchText = '', categories = '') => {
    console.log(categories);
    if (categories == '') categories = this.state.selectedCategories;
    if (searchText == '') searchText = this.state.searchText;

    let date = `${this.props.route.params.month}/${this.props.route.params.year}`;
    this.entryHandler
      .getSearchDatesFromMonthAndYear(searchText, date, categories)
      .then((dates) => {
        this.setState({
          dates: dates,
          edit: false,
        });
      });

    this.entryHandler
      .getSearchMonthTotal(searchText, date, categories)
      .then((total) => {
        this.setState({total: total});
      });
  };

  openImage = (id) => {
    const path = this.cameraImageHandler.getImagePath(id);
    this.setState({
      showImage: true,
      imagePath: path,
    });
    console.log(path);
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

    // setTimeout(this.getDates, 50);
    this.getDates();
  }

  handleSearch = () => {
    this.setState({
      // searchText: text,
      edit: true,
    });

    setTimeout(this.getDates, 50);
    // this.getDates();
  };

  saveCategories = (categories) => {
    const cats = getSelectedCategories(categories);
    this.setState({
      selectedCategories: cats,
      edit: true,
    });
    this.getDates(this.state.searchText, cats);
  };

  render() {
    return (
      <View style={global.container}>
        <SearchBar
          containerStyle={styles.searchBarContainer}
          placeholder="Type Here..."
          inputContainerStyle={styles.searchBarInputContainer}
          onChangeText={(text) => {
            this.setState({searchText: text});
          }}
          value={this.state.searchText}
          onClear={this.handleSearch}
          onSubmitEditing={this.handleSearch}
        />
        <FlatList
          style={[global.list, styles.dateList]}
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
                openImage={this.openImage}
              />
            );
          }}></FlatList>
        <Text style={global.footer}>
          Total: $ {this.state.total.toFixed(2)}
        </Text>

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
        <CameraImagePreviewModal
          visible={this.state.showImage}
          uri={this.state.imagePath}
          close={() => {
            this.setState({showImage: false});
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  dateList: {
    marginBottom: 20,
  },
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

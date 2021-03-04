import React, {Component} from 'react';
import {FlatList, Modal, StyleSheet, Text, View} from 'react-native';
import {Icon} from 'react-native-elements';
import CategoryDBHandler from '../databasehandler/categoryhandler';
import EntryDBHandler from '../databasehandler/entryhandler';
import {ButtonColors} from '../styles/colors';
import {global} from '../styles/global';
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
    };
    this.entryHandler = new EntryDBHandler();
    this.categoryHandler = new CategoryDBHandler();
  }

  getYears = () => {
    console.log('Get Year Called');
    const categoryString = getSelectedCategories(this.state.categories).join(
      ',',
    );
    this.entryHandler.getYears(categoryString).then((years) => {
      this.setState({
        years: years,
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

        this.getYears();
      });
  }

  saveCategories = (categories) => {
    this.setState({
      categories: categories,
    });
    this.getYears();
  };
  render() {
    return (
      <View style={global.container}>
        <View style={global.list}>
          {this.state.years.map((year) => {
            return (
              <Year
                type={this.props.route.params.type}
                key={year}
                year={year}
                categories={getSelectedCategories(this.state.categories)}
                navigation={this.props.navigation}
              />
            );
          })}
        </View>
        {/* <FlatList
          extraData={this.state.categories}
          style={global.list}
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
                categories={this.state.categories}
                navigation={this.props.navigation}
              />
            );
          }}
        /> */}
        <View style={global.floatingButton}>
          <Icon
            raised
            color={ButtonColors.floatingAdd}
            name="add"
            type="material"
            reverse
            onPress={() =>
              this.props.navigation.navigate('AddEntry', {
                type: this.props.route.params.type,
              })
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

const styles = StyleSheet.create({});

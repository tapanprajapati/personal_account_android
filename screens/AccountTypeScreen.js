import React, {Component} from 'react';
import {FlatList, Modal, StyleSheet, Text, View} from 'react-native';
import {Icon} from 'react-native-elements';
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
    };
    this.entryHandler = new EntryDBHandler();
    this.categoryHandler = new CategoryDBHandler();
  }

  getYears = () => {
    const categoryString = getSelectedCategories(this.state.categories).join(
      ',',
    );
    this.entryHandler.getYears(categoryString).then((years) => {
      this.setState({
        years: years,
      });
    });
  };

  addToTotal = (amount) => {
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

        this.getYears();
      });
  }

  saveCategories = (categories) => {
    this.setState({
      categories: categories,
      total: 0,
    });
    this.getYears();
  };
  render() {
    return (
      <View style={global.container}>
        <FlatList
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
                categories={getSelectedCategories(this.state.categories)}
                navigation={this.props.navigation}
                passTotal={this.addToTotal}
              />
            );
          }}
        />
        <Text style={styles.footer}>Total: $ {this.state.total}</Text>
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
                refresh: this.getYears,
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

const styles = StyleSheet.create({
  footer: {
    width: '100%',
    textAlign: 'center',
    backgroundColor: TextBackground.footerTotal,
    color: 'white',
    fontSize: dimensions.accountType.footerText,
    fontWeight: 'bold',
  },
});

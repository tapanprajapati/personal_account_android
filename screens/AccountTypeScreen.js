import React, {Component} from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';
import {Icon} from 'react-native-elements';
import EntryDBHandler from '../databasehandler/entryhandler';
import {ButtonColors} from '../styles/colors';
import {global} from '../styles/global';
import Year from './Lists/Year';

export default class AccountType extends Component {
  constructor(props) {
    super(props);
    this.state = {
      years: [],
    };

    this.entryHandler = new EntryDBHandler();
  }

  componentDidMount() {
    this.entryHandler.getYears(null).then((years) => {
      console.log(years);
      this.setState({
        years: years,
      });
    });
  }
  render() {
    return (
      <View style={global.container}>
        <FlatList
          style={global.list}
          data={this.state.years}
          keyExtractor={(item) => {
            item;
          }}
          renderItem={({item}) => {
            return (
              <Year
                type={this.props.route.params.type}
                key={item}
                year={item}
                navigation={this.props.navigation}
              />
            );
          }}
        />
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
      </View>
    );
  }
}

const styles = StyleSheet.create({});

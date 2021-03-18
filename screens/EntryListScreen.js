import React, {Component} from 'react';
import {FlatList, View} from 'react-native';
import EntryDBHandler from '../databasehandler/entryhandler';
import {global} from '../styles/global';
import Date from './Lists/Date';

export default class EntryList extends Component {
  constructor(props) {
    super(props);
    this.entryHandler = new EntryDBHandler();
    this.state = {
      dates: [],
    };
  }

  getDates = () => {
    let date = `${this.props.route.params.month}/${this.props.route.params.year}`;
    this.entryHandler
      .getDatesFromMonthAndYear(date, this.props.route.params.categories)
      .then((dates) => {
        this.setState({
          dates: dates,
        });
      });
  };

  componentDidMount() {
    this.getDates();
  }

  render() {
    return (
      <View style={global.container}>
        <FlatList
          style={global.list}
          data={this.state.dates}
          keyExtractor={(item) => item}
          renderItem={({item}) => {
            return (
              <Date
                navigation={this.props.navigation}
                date={item}
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

import React, {Component} from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';

export default class HomeButton extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const customStyle = StyleSheet.create({
      back: {
        backgroundColor: this.props.color,
      },
    });
    return (
      <TouchableOpacity
        onPress={this.props.onPress}
        style={[styles.card, customStyle.back]}>
        <Text style={styles.cardTitle}>{this.props.title}</Text>
        <Text style={styles.cardSecondaryText}>
          Total: $ {this.props.total}
        </Text>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 2,
    elevation: 5,
    width: '60%',
    alignSelf: 'center',
    shadowColor: 'grey',
    padding: 15,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
    alignSelf: 'center',
  },
  cardSecondaryText: {
    fontSize: 12,
    color: '#eee',
    alignSelf: 'center',
  },
});

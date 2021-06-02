import React, {Component} from 'react';
import {Text} from 'react-native';
import {StyleSheet} from 'react-native';
import {View} from 'react-native';
import {Icon} from 'react-native-elements';
import {ButtonColors} from '../styles/colors';
import {global} from '../styles/global';

export default class Category extends Component {
  constructor(props) {
    super(props);
    this.controlButtonSize = 20;
  }

  render() {
    return (
      <View style={[styles.container, global.shadow]}>
        <Text style={styles.title}>{this.props.data.title}</Text>
        <View style={styles.controlList}>
          <Icon
            name="create"
            type="material"
            size={this.controlButtonSize}
            containerStyle={styles.controlButton}
            onPress={() => this.props.handleEdit(this.props.data)}
            color={ButtonColors.entryControl.edit}></Icon>
          <Icon
            name="delete"
            type="material"
            size={this.controlButtonSize}
            containerStyle={styles.controlButton}
            color={ButtonColors.entryControl.delete}></Icon>

          <Icon
            name="swap-horiz"
            type="material"
            size={this.controlButtonSize}
            containerStyle={styles.controlButton}
            color={ButtonColors.entryControl.delete}></Icon>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 4,
    margin: 4,
  },
  controlList: {
    flex: 2.5,
    flexDirection: 'row',
  },
  title: {
    fontSize: 16,
    flex: 6,
    fontWeight: 'bold',
    // color: 'steelblue',
  },
  controlButton: {
    alignSelf: 'center',
    flex: 1,
    marginHorizontal: 2,
  },
});

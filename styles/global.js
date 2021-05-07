import {StyleSheet} from 'react-native';
import {dimensions} from '../utils/constants';

const global = StyleSheet.create({
  container: {
    flex: 1,
    padding: 7,
    backgroundColor: '#fff',
  },
  floatingButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  list: {
    marginHorizontal: 5,
  },
  footer: {
    width: '100%',
    textAlign: 'center',
    position: 'absolute',
    bottom: 3,
    // backgroundColor: TextBackground.footerTotal,
    color: 'steelblue',
    fontSize: dimensions.accountType.footerText,
    fontWeight: 'bold',
  },
  shadow: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderBottomWidth: 0,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.8,
    shadowRadius: 5,
    elevation: 1,
  },

  graphTitle: {
    color: '#396884',
    fontSize: 18,
    margin: 3,
    textAlign: 'center',
  },
});

export {global};

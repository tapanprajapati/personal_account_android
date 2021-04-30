import {StyleSheet} from 'react-native';

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
  shadow:{
    borderWidth: 1,
    borderColor: '#ddd',
    borderBottomWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
    elevation: 1,
  },

  graphTitle:{
    color: '#396884',
    fontSize: 18,
    margin: 3,
    textAlign: 'center'
  }
});

export {global};

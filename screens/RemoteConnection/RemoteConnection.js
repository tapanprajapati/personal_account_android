import React, {Component} from 'react';
import {TextInput} from 'react-native';
import {Button} from 'react-native-elements';
import {Text, View, StyleSheet} from 'react-native';
import CategoryDBHandler from '../../databasehandler/categoryhandler';
import EntryDBHandler from '../../databasehandler/entryhandler';
import axios from 'axios';

export default class RemoteConnection extends Component {
  constructor(props) {
    super(props);
    this.entryHandler = new EntryDBHandler();
    this.categoryHandler = new CategoryDBHandler();
    this.state = {
      remoteURL: 'http://192.168.0.108:5001',
      intervalID: 0,
      lastRequest: {},
    };
  }

  updateRemoteURL = (text) => {
    this.setState({
      remoteURL: text,
    });
  };

  startServer = () => {
    console.log('Starting Listing Remote Server');
    console.log(this.state.remoteURL);
    const refreshFreq = 3;
    let intervalid = setInterval(this.listen, 1000 / refreshFreq);
    this.setState({
      intervalID: intervalid,
    });
    // this.listen();
  };

  componentWillUnmount() {
    console.log('Clearing Interval');
    clearInterval(this.state.intervalID);
  }

  listen = () => {
    let getURL = `${this.state.remoteURL}/api/request`;
    // console.log(getURL);
    axios
      .get(getURL)
      .then((result) => {
        if (
          JSON.stringify(result.data) == JSON.stringify(this.state.lastRequest)
        ) {
          return;
        }
        console.log(result.data);
        let request = result.data.request;

        console.log(request);
        if (request == 'year') {
          console.log('Requesting Year');
          this.sendYear(result.data);
        } else if (request == 'category') {
          console.log('Requesting Categories');
          this.sendCategories(result.data);
        } else if (request == 'entry') {
          console.log('Requesting Entries');
          this.sendEntries(result.data);
        }

        this.setState({lastRequest: result.data});
      })
      .catch((error) => {
        console.error(error);
      });
  };

  sendYear = (request) => {
    let yearsList = [];
    this.entryHandler
      .getYears(request.categories)
      .then((years) => {
        if (years.length == 0) {
          this.sendData(request, []);
        }
        years.forEach((year) => {
          this.entryHandler
            .getMonthsOfYear(year, request.categories)
            .then((months) => {
              yearsList.push({
                year: year,
                months: months,
              });

              if (yearsList.length == years.length) {
                this.sendData(request, yearsList);
              }
            })
            .catch((error) => console.error(error));
        });
      })
      .catch((error) => console.error(error));
  };

  sendCategories = (request) => {
    this.categoryHandler
      .getCategories(request.type.toLowerCase())
      .then((categories) => {
        this.sendData(request, categories);
      })
      .catch((error) => console.error(error));
  };

  sendEntries = (request) => {
    this.entryHandler
      .getDatesFromMonthAndYear(request.date, request.categories)
      .then((dates) => {
        console.log(dates);

        if (dates.length == 0) {
          this.sendData(request, []);
        }
        let entryList = [];

        dates.forEach((date) => {
          this.entryHandler
            .getEntries(`${date}/${request.date}`, request.categories)
            .then((entries) => {
              let entry = {
                date: date,
                entries: entries,
              };

              entryList.push(entry);

              if (entryList.length == dates.length) {
                this.sendData(request, entryList);
              }
            });
        });
      });
  };

  sendData = (request, data) => {
    let URL = `${this.state.remoteURL}/api/response`;

    console.log('Sending data');
    console.log(data);
    axios
      .post(URL, {
        response: request,
        data: data,
      })
      .then((result) => {
        console.log(result.status);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  render() {
    return (
      <View style={styles.main}>
        <View style={styles.inputContainer}>
          <Text style={styles.remoteTitle}>Enter Remote Server</Text>
          <TextInput
            placeholder="Ex: localhost or 127.0.0.1"
            keyboardType="default"
            style={styles.remoteInput}
            value={this.state.remoteURL}
            onChangeText={this.updateRemoteURL}></TextInput>
          <Button
            buttonStyle={styles.remoteStartButton}
            title="Start"
            onPress={this.startServer}></Button>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  main: {
    padding: 20,
  },
  inputContainer: {},
  remoteTitle: {
    alignSelf: 'center',
    fontSize: 20,
  },
  remoteInput: {
    borderColor: 'grey',
    borderWidth: 1,
    margin: 4,
    paddingVertical: 3,
    borderRadius: 5,
    fontSize: 16,
  },
  remoteStartButton: {
    margin: 4,
  },
});

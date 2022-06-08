import { Picker } from "@react-native-picker/picker";
import React, { Component } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { Button } from "react-native-elements";
import LocalStorage from "../../databasehandler/local-storage/Storage";
import UserDBHandler from "../../databasehandler/userhandler";
import { ButtonColors } from "../../styles/colors";
import { dimensions } from "../../utils/constants";

export default class ConfigScreen extends Component {
    constructor(props)
    {
        super(props)
        this.storage = new LocalStorage();
        this.userHandler = new UserDBHandler()
        this.state = {
            IP: this.storage.IP,
            user: this.storage.user,
            users: []
        }
    }

    componentDidMount()
    {
        this.userHandler.getAllUsers().then(result=>{
            if(result.success)
            {
                const data = result.message
                this.setState({
                    users: data
                })
    
                if(this.state.user==="")
                {
                    this.setState({
                        user: data[0]
                    })
                }
            }
            else
            {
              Alert.alert('ERROR', `${result.message.toUpperCase()}`, [
            {
              text: 'Close',  
            },
          ]);
            }
        })
    }

    saveConfigs = () => {
        this.storage.setIP(this.state.IP)
        this.storage.setUser(this.state.user)
    }

    render(){
        return(
            <View style={styles.main}>
                <View style={styles.container}>
                    <View style={styles.inputHolder}>
                        <Text style={styles.inputText}>Host</Text>
                        <TextInput
                        value={this.state.IP}
                        style={[styles.inputElement, styles.textInput]}
                        keyboardType="default"
                        onChangeText={(text)=>{this.setState({IP: text})}
                        }></TextInput>
                    </View>
                    <View style={[styles.inputHolder]}>
                        <Text style={styles.inputText}>User</Text>
                        <Picker
                        onValueChange={(value, index) => {
                            this.setState({user: value});
                        }}
                        selectedValue={this.state.user}
                        style={([styles.inputElement, styles.dropDown])}
                        mode="dropdown">
                        {this.state.users.map((item) => {
                            return (
                            <Picker.Item
                                key={item.username}
                                label={item.username}
                                value={item.username}
                            />
                            );
                        })}
                        </Picker>
                    </View>
                    <View style={styles.inputButtonHolder}>
                        <Button
                        containerStyle={{
                            marginTop: 0,
                        }}
                        buttonStyle={styles.button}
                        title="Save"
                        color={ButtonColors.entryAdd}
                        titleStyle={{fontSize: dimensions.entryForm.input.buttonFont}}
                        onPress={this.saveConfigs}
                        />
                    </View>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        marginVertical: 15,
        marginHorizontal: 25
    },
    inputHolder: {
        flexDirection: 'row',
        marginBottom: dimensions.entryForm.input.margin,
    },
    inputButtonHolder: {
        marginTop: 30,
    },
    inputPickerHolder: {
        marginBottom: dimensions.entryForm.input.margin,
        height: dimensions.entryForm.input.dropdownHeight,
        flexDirection: 'row',
    },
    inputText: {
        fontSize: dimensions.entryForm.input.text,
        color: 'grey',
        marginBottom: dimensions.entryForm.input.textMargin,
        flex: 0.2
    },
    inputElement: {
        flex: 0.8
    },
    dropDown: {
        height: dimensions.entryForm.input.dropdownHeight,
    },
    textInput: {
        borderWidth: 1,
        paddingVertical: 5,
        paddingHorizontal: dimensions.entryForm.input.inputPaddingHorizontal,
        borderColor: '#ccd',
        borderRadius: 4,
        fontSize: dimensions.entryForm.input.text,
    },
    button: {
        height: dimensions.entryForm.input.buttonHeight,
        backgroundColor: ButtonColors.entryAdd,
        fontSize: dimensions.entryForm.input.buttonFont,
    },
})
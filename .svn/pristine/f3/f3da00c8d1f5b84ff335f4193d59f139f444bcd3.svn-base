import React, { Component } from "react";
import { Alert,BackHandler } from 'react-native';
import { AndroidBackHandler } from 'react-navigation-backhandler';
import I18n from 'react-native-i18n';

export default class BackButton extends React.Component {

  onBackButtonPressAndroid = () => {
    /*
     *   Returning `true` from `onBackButtonPressAndroid` denotes that we have handled the event,
     *   and react-navigation's lister will not get called, thus not popping the screen.
     *
     *   Returning `false` will cause the event to bubble up and react-navigation's listener will pop the screen.
     * */
    Alert.alert(
        I18n.t('Exit_Title'),
        I18n.t('Exit_Message'),
        [
            {
                text: I18n.t('cancel'),
                onPress: () => {
                    console.log('Cancel Pressed')
                },
                style: 'cancel'
            },
            {
                text: I18n.t('ok'),
                onPress: () => {
                    BackHandler.exitApp()
                }
            }
        ],
        {
            cancelable: false
        }
    );
    return true;
  };

  render() {
    return (
        <AndroidBackHandler onBackPress={this.onBackButtonPressAndroid} />
    );
  }

}
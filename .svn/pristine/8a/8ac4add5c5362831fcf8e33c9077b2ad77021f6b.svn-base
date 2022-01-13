import React, { Component } from 'react';
import { Root } from "native-base";
import { connect } from 'react-redux';
import {
  InitialView,
  LoginStackNavigatorLogin,
  PrivateStackNavigator,
  PublicStackNavigator,
  WalkthroughStackNavigatorLogin,
  WalkthroughStackServerSelection
} from './navigators'
import DeviceInfo from 'react-native-device-info';
import repo from './services/database/repository'
import { loadDrawerType } from './actions/drawer'
import I18n from "react-native-i18n";
import PropTypes from 'prop-types';
import { syncData } from './actions/syncData'
import QueueJobFactory from "./QueueJobFactory";
import securityService from "./services/security/securityService";
import waterfall from 'async/waterfall';
import { loggedInRedux } from './actions/security';
import { reloadMenu } from './actions/general';
import './ReactotronConfig';
import firebaseService from "./services/firebase/firebaseService";
import TimerMixin from "react-timer-mixin";
import { Platform } from "react-native";

import {changeLanguage} from './services/i18n/index';


class App extends Component {


  constructor() {
    super();
    
    changeLanguage();
    this.modeDebbug = false;
    this.loadData = null;
    this.first = true;
    this.state = {
      isLoading: true, //TO TRUE
      isReady: false,//TO FALSE
      messageAlert: false,
    };
    
    if (Platform.OS === 'android') {
      DeviceInfo.getIPAddress().then(ip => {
        repo.configuration.setField('userIp', ip);
      })
    }

    this.initialRouteName = 'DrawerInitial';
  }


  componentWillMount() {
    repo.configuration.setField('refresh_token', null);
    repo.configuration.setField('access_token', null);
    repo.configuration.setField('expires_token', null);
    repo.configuration.setField('grant_type', null);
  }

  componentWillUnmount() {
    this.onTokenRefreshListener();
    this.messageListener();
    this.notificationDisplayedListener();
    this.notificationListener();
  }
  
  notificationAction(){
    this.props.reloadMenuAlerts();
  }

  componentDidMount() {
    firebaseService.loadApp();
    firebaseService.supervisorAnalytic('APP');

    this.onTokenRefreshListener = firebaseService.onTokenRefreshListener();
    this.messageListener = firebaseService.onRemoteMessage();
    this.notificationDisplayedListener = firebaseService.onNotificationDisplayed();
    this.notificationListener = firebaseService.onNotification(()=>this.notificationAction());

    let confObj = repo.configuration.findObj();
	
    let conf = {
		id: 1,
		//domain: 'http://10.0.2.2:8080/api',
		//domain: 'https://ss-node.herokuapp.com/api',
		first_time: false,
		version_app: DeviceInfo.getVersion(),
		phone_hwid: DeviceInfo.getUniqueID(),
		app_status: 'LOGOUT',
		language: (I18n.locale && I18n.locale.length > 2 ) ? I18n.locale.substr(0, 2) : I18n.locale,
	};
    
    if( confObj === null || (confObj && confObj.first_time) ) {
    	//this.initialRouteName = 'DrawerWalkthrough';
    	this.initialRouteName = 'DrawerServerSelection';
    	if(confObj === null){
        	repo.configuration.save(conf);
    	}else{
        	repo.configuration.update(conf);
    	}
    } else {
    	repo.configuration.update(conf);
    	let password_remember = repo.configuration.getField('password_remember');
    	if( password_remember ) {
    		let user_username = repo.configuration.getField('user_username');
    		let user_plain_password = repo.configuration.getField('user_plain_password');

    		waterfall([
    			( callback ) => {
    				securityService.autenticateAction('password', user_username, user_plain_password, callback);
    			}
    			], ( err, result ) => {
    				if( !err ) {
    					this.props.loggedInRedux();
    				} else {
                        TimerMixin.setTimeout(() => {
                            this.setState({ isLoading: false });
                        }, 1500);
    					this.initialRouteName = 'DrawerLogin';
    				}
    			});
    	} else {
    		this.initialRouteName = 'DrawerLogin';
    	}
    }

    setTimeout(() => {
    	this.setState({ isLoading: false });
    }, 1500);
  }


  componentWillReceiveProps( nextProps ) {
    //appLoggedOut
    if( this.props.appLoggedOut !== nextProps.appLoggedOut ) {
      this.initialRouteName = 'DrawerLogin'
    }
    //appLoggedIn
    if( this.props.appLoggedIn !== nextProps.appLoggedIn ) {
      this.initialRouteName = 'DrawerPrivate'
    }
    //appLogIn
    if( this.props.appLogIn !== nextProps.appLogIn ) {
      this.initialRouteName = 'DrawerLogin'
    }

  }

  _renderNavigator() {
    if( this.state.isLoading )
      return (<InitialView/>);
    else {
      if( this.initialRouteName === 'DrawerLogin' ){
        return (<LoginStackNavigatorLogin/>);
      }else if( this.initialRouteName === 'DrawerPrivate' ) {
        return (<PrivateStackNavigator/>);
      } else if( this.initialRouteName === 'DrawerPublic' ) {
        return (<PublicStackNavigator/>);
      } else if( this.initialRouteName === 'DrawerWalkthrough' ) {
        return (<WalkthroughStackNavigatorLogin/>);
      } else if( this.initialRouteName === 'DrawerInitial' ) {
        return (<InitialView/>);
      } else if( this.initialRouteName === 'DrawerServerSelection' ) {
        return (<WalkthroughStackServerSelection/>);
      }

    }
  }

  render() {
    return (
      <Root>
        <QueueJobFactory/>
        {this._renderNavigator()}
      </Root>
    )
  }
}


Component.propTypes = {
  loadDrawerType: PropTypes.func,
  syncData: PropTypes.func,
};


function bindAction( dispatch ) {
  return {
    loggedInRedux: () => dispatch(loggedInRedux()),
    reloadMenuAlerts: () => dispatch(reloadMenu()),
    syncData: () => dispatch(syncData()),
    loadDrawerType: ( type ) => dispatch(loadDrawerType(type)),
  };
}

const mapStateToProps = state => ({
  appLoggedIn: state.securityReducer.appLoggedIn,
  appLoggedOut: state.securityReducer.appLoggedOut,
  appLogIn: state.securityReducer.appLogIn
});

export default connect(mapStateToProps, bindAction)(App);


import React, { Component } from "react";
import { Image, TouchableOpacity } from 'react-native';
import { Text, View, Content, Icon, Header, Button } from "native-base";
import { Field } from "redux-form";
import I18n from 'react-native-i18n';

import {platformStyle} from "../../../theme";
import sharedStyles from '../../../shared/styles';
import styles from './styles'
import ImgBackgroundContainer from '../../../components/ImageBackground/';
import IconFontello from '../../../components/IconFontello/';
import splash from "../../../../assets/images/splash_blurred.png";
import yellowImg from "../../../../assets/images/yellow_login.png";
import logo from "../../../../assets/images/kplc.png";
import { connect } from 'react-redux';
import { logInRedux, loggedOutRedux } from '../../../actions/security'
import * as OpenAnything from 'react-native-openanything';
import DeviceInfo from 'react-native-device-info';
import firebaseService from "../../../services/firebase/firebaseService";
import Config from 'react-native-config';
import BackButton from '../../../components/BackButton';



class Home extends Component {

  constructor() {
    super();
    this.state = {
      filter: 'account'
    }
    
  }

  componentDidMount() {
    firebaseService.supervisorAnalytic('PUBLIC');
  }

  render() {

    const navigation = this.props.navigation;
    let versionDevice = DeviceInfo.getVersion().toString();

    return (
      <ImgBackgroundContainer source={splash}>
        <Header transparent style={{ height: 40 }}/>
        <View style={{ ...sharedStyles.alignItems('end'), flexDirection: 'row', justifyContent: 'space-between' }}>
          <Image source={logo} style={{ height: 90, marginLeft: 10 }}/>
          <Image source={yellowImg}/>
        </View>
        <Content style={styles.content}>
          <BackButton/>

          <Button wide2 largeB style={{...styles.loginBtn, backgroundColor: platformStyle.brandPrimary}} onPress={() => {
            OpenAnything.Open(Config.OUTGAGE_PORTAL);
          }}>
            <IconFontello name={'complain'} size={30}
                          style={{ color: platformStyle.brandWhite, }}/>
            <Text medio heavy white mH>{I18n.t('Planned_interruptions').toUpperCase()}</Text>
          </Button>
         

          <Button wide2 largeB style={{ ...styles.loginBtn, backgroundColor: 'white' }} onPress={() => {
            this.props.logInRedux();
          }}>
            <IconFontello name={'exit'} size={28}
                          style={{ color: platformStyle.brandPrimary, }}/>

            <Text medio heavy mH style={{color: platformStyle.brandPrimary}}>{I18n.t('login').toUpperCase()}</Text>
          </Button>
          
          
        </Content>
        

      </ImgBackgroundContainer>
    )
      ;
  }
}


const mapStateToProps = state => ({});

function bindAction( dispatch ) {
  return {
    logInRedux: () => dispatch(logInRedux()),
    loggedOutRedux: () => dispatch(loggedOutRedux()),
  };
}


export default connect(mapStateToProps, bindAction)(Home);


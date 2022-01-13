import React, { Component } from "react";
import { Image, FlatList, TouchableOpacity } from 'react-native';
import { Text, View, Content, Container, Left, Body, Button, Row, Col, Icon, Thumbnail } from "native-base";
import { Field, reduxForm } from "redux-form";
import I18n from 'react-native-i18n';
import repo from '../../services/database/repository';
import TouchID from 'react-native-touch-id';

import {platformStyle} from "../../theme";
import Header from '../../components/Header';
import styles from './styles'
import { connect } from 'react-redux';
import Swiper from 'react-native-swiper';
import { loggedOutRedux } from '../../actions/security'

const Walkthrough1 = require("../../../assets/images/icons/Walkthrough1.png");
const Walkthrough2 = require("../../../assets/images/icons/Walkthrough2.png");
const Walkthrough3 = require("../../../assets/images/icons/Walkthrough3.png");

class Tips extends Component {

  constructor() {
    super();

    this.state = {
      spinnerVisible: false,
    }
  }

  componentDidMount(){
    let activateFingerprint = repo.configuration.getField('activateFingerprint');
    if(activateFingerprint=="NOT_CHECKED"){
      const optionalConfigObject = {
        unifiedErrors: false, // use unified error messages (default false)
        passcodeFallback: false // if true is passed, itwill allow isSupported to return an error if the device is not enrolled in touch id/face id etc. Otherwise, it will just tell you what method is supported, even if the user is not enrolled.  (default false)
      };

      TouchID.isSupported(optionalConfigObject)
          .then(biometryType => {
            // Success code
            if (biometryType === 'FaceID') {
              console.log('FaceID is supported.');
              repo.configuration.setField('activateFingerprint',"yes");
            } else {
              console.log('TouchID is supported.');
              repo.configuration.setField('activateFingerprint',"yes");
            }
          })
          .catch(error => {
            repo.configuration.setField('activateFingerprint',"no");
          });
    }
  }


  render() {
    return (
      <Container>
        <Header {...this.props} noDrawer
                iconAction={'ios-home-outline'}/>
        <View style={{...styles.container, backgroundColor: platformStyle.brandPrimary}}>
          <View style={{ marginTop: 10 }}><Text xlarge white heavy>{I18n.t("NEW_SS")}</Text></View>
        </View>

        <Swiper style={styles.wrapper} showsButtons={false}
                activeDotStyle={{
                  backgroundColor: platformStyle.brandPrimary,
                  width: 18,
                  height: 18,
                  borderRadius: 9,
                  marginLeft: 6,
                  marginRight: 6,
                  marginTop: 6,
                  marginBottom: 6,
                }}
                dotStyle={{
                  backgroundColor: '#CCCCCC',
                  width: 18,
                  height: 18,
                  borderRadius: 9,
                  marginLeft: 6,
                  marginRight: 6,
                  marginTop: 6,
                  marginBottom: 6,
                }}

        >
          <View style={styles.slide1}>
            <Thumbnail source={Walkthrough1} large xxlarge
                       style={{
                         justifyContent: 'center',
                         borderColor: platformStyle.brandPrimary,
                         borderWidth: 0,
                         marginVertical: 30
                       }}/>
            <Text mlarge black medium>{I18n.t("KNOW_BILL")}</Text>
            <Text large dark medium>
            	{I18n.t("DOWNLOAD_BILL")}
            </Text>
            <Button block rounded wide style={{...styles.loginBtn, backgroundColor: platformStyle.brandPrimary}}
                    onPress={() => {this.props.loggedOutRedux()}}>
              <Text>{I18n.t('SKIP')}</Text>
            </Button>
          </View>

          <View style={styles.slide1}>
            <Thumbnail source={Walkthrough2} large xxlarge
                       style={{
                         justifyContent: 'center',
                         borderColor: platformStyle.brandPrimary,
                         borderWidth: 0,
                         marginVertical: 30
                       }}/>
            <Text mlarge black medium>{I18n.t("SEND_READS")}</Text>
            <Text large dark medium>{I18n.t("SEND_CURRENT_READS")}</Text>
            <Button block rounded wide style={{...styles.loginBtn, backgroundColor: platformStyle.brandPrimary}}
                    onPress={() => {this.props.loggedOutRedux()}}>
              <Text>{I18n.t('SKIP')}</Text>
            </Button>
          </View>

          <View style={styles.slide1}>
            <Thumbnail source={Walkthrough3} large xxlarge
                       style={{
                         justifyContent: 'center',
                         borderColor: platformStyle.brandPrimary,
                         borderWidth: 0,
                         marginVertical: 30
                       }}/>
            <Text mlarge black medium>{I18n.t('WALKTHROUGH_3_TITLE')}</Text>
            <Text large dark medium>{I18n.t("WALKTHROUGH_3_CONTENT")}</Text>
            <Button block rounded wide style={{...styles.loginBtn, backgroundColor: platformStyle.brandPrimary}}
                    onPress={() => {this.props.loggedOutRedux()}}>
              <Text>{I18n.t('Continue')}</Text>
            </Button>

          </View>


        </Swiper>
      </Container>
    );
  }
}


Component.propTypes = {};

function bindAction( dispatch ) {
  return {
    loggedOutRedux: () => dispatch(loggedOutRedux()),
  };
}

const mapStateToProps = state => ({});

export default connect(mapStateToProps, bindAction)(Tips);

import React, { Component } from "react";
import { Image } from 'react-native';
import { Text, View, Container } from "native-base";
import { Field } from "redux-form";
import I18n from 'react-native-i18n';

import Header from '../../components/Header';
import SubHeader from '../../components/SubHeader';
import styles from './styles'
import {platformStyle} from "../../theme";
import { connect } from 'react-redux';
import Swiper from 'react-native-swiper';
import IconFontello from '../../components/IconFontello/';
import DeviceInfo from 'react-native-device-info';
import firebaseService from "../../services/firebase/firebaseService";

class Contact extends Component {

  constructor() {
    super();

    this.state = {
      parent: null,
    }
  }

  componentDidMount() {
    const { params } = this.props.navigation.state;
    firebaseService.supervisorAnalytic('ABOUT');


    this.setState({
      parent: (params && params.parent) ? params.parent : 'PUBLIC',
    });

  }

  render() {
    return (
      <Container>
        <Header {...this.props} noDrawer
                iconAction={true}/>


        <SubHeader text={I18n.t('ABOUT')} back={true} {...this.props}
        />

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
            <View style={styles.container}>
              <View style={{...styles.iconContainer, backgroundColor: platformStyle.brandPrimary}}>

                <IconFontello name={'info'} size={50}
                              style={{ color: platformStyle.brandWhite, }}/>
              </View>
              <View style={{ marginTop: 10 }}><Text xlarge heavy style={{color: platformStyle.brandPrimary}}>{I18n.t('ABOUT').toUpperCase()}</Text></View>
            </View>
            <Text large dark medium style={styles.textSlide}>{I18n.t("SS_CUSTOMERS")}</Text>
            <Text large dark medium style={styles.textSlide}>{I18n.t("Version")}: {DeviceInfo.getVersion()}</Text>
          </View>


        </Swiper>
      </Container>
    );
  }
}


Component.propTypes = {};

function bindAction( dispatch ) {
  return {};
}

const mapStateToProps = state => ({});

export default connect(mapStateToProps, bindAction)(Contact);

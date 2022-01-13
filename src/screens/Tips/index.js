import React, { Component } from "react";
import { Image } from 'react-native';
import { Text, View, Container } from "native-base";
import { Field } from "redux-form";
import I18n from 'react-native-i18n';

import Header from '../../components/Header';
import SubHeader from '../../components/SubHeader';
import styles from './styles'
import { platformStyle } from "../../theme";
import { connect } from 'react-redux';
import Swiper from 'react-native-swiper';
import IconFontello from '../../components/IconFontello/';
import generalService from "../../services/general/generalService";
import waterfall from "async/waterfall";
import Spinner from '../../components/Spinner';
import PopupDialog from '../../components/PopupDialog/';
import firebaseService from "../../services/firebase/firebaseService";
import TimerMixin from "react-timer-mixin";


class Tips extends Component {

  constructor() {
    super();

    this.state = {
      spinnerVisible: false,
      parent: null,
      data: [],
    }
  }



  componentDidMount() {
    firebaseService.supervisorAnalytic('TIPS');
    const { params } = this.props.navigation.state;
    this.setState({ spinnerVisible: true, parent: (params && params.parent) ? params.parent : 'PUBLIC' });

    waterfall([
      (callback) => {
        console.log('hola desde emulador');
        generalService.tipsInformationAction(callback);
      }
    ], (err, result) => {
      if (!err) {
        if (result && result.tipsInformation) {
          this.setState({ data: result.tipsInformation, spinnerVisible: false });
        } else {
          this.setState({ data: [], spinnerVisible: false });
        }
      } else {
        this.setState({
          spinnerVisible: false
        }, function () {
          TimerMixin.setTimeout(() => {
            this.setState(err)
          }, 1000);
        });
      }
    })


  }


  render() {
    let tips = this.state.data;
    return (
      <Container>
        <Header {...this.props} noDrawer
          iconAction={true} />
        <SubHeader text={I18n.t("IMPORTANT_TIPS")} back={true} {...this.props}
        />
        <PopupDialog
          refModal={this.state.messageAlert}
        />
        <View style={styles.container}>
          <View style={{ ...styles.iconContainer, backgroundColor: platformStyle.brandPrimary }}>

            <IconFontello name={'tips'} size={50}
              style={{ color: platformStyle.brandWhite, }} />
          </View>
          <View style={{ marginTop: 10 }}><Text xlarge heavy style={{ color: platformStyle.brandPrimary }}>{I18n.t("IMPORTANT_TIPS")}</Text></View>
        </View>

        {tips.length ?
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

            {tips.map((data) => {
              return (
                <View key={data.idNews} style={styles.slide1}>
                  <Text style={{ fontSize: 24 }}>{data.title}</Text>
                  <Text large dark medium>{data.text}</Text>
                </View>
              )
            })}


          </Swiper> : null}
        <Spinner visible={this.state.spinnerVisible} textContent="..." />
      </Container>
    );
  }
}


Component.propTypes = {};

function bindAction(dispatch) {
  return {};
}

const mapStateToProps = state => ({});

export default connect(mapStateToProps, bindAction)(Tips);

import React, {Component} from "react";
import {Image} from 'react-native';
import {Text, View, Container, Button} from "native-base";
import {Field} from "redux-form";
import I18n from 'react-native-i18n';
import Header from '../../components/Header';
import SubHeader from '../../components/SubHeader';
import YellowSubHeader from '../../components/YellowSubHeader/';
import styles from './styles'
import {platformStyle} from "../../theme";
import {connect} from 'react-redux';
import Swiper from 'react-native-swiper';
import IconFontello from '../../components/IconFontello/';
import * as OpenAnything from 'react-native-openanything';
import Map from '../Map/';
import firebaseService from "../../services/firebase/firebaseService";
import generalService from "../../services/general/generalService";
import waterfall from 'async/waterfall';
import Config from 'react-native-config';


class Contact extends Component {

  constructor() {
    super();

    this.state = {
      renderMap: false,
      index: 0,
      markers: []
    }
  }

  componentDidMount() {

    firebaseService.supervisorAnalytic('CONTACT');

    waterfall([
          (callback) => {
            generalService.GetOffices(callback);
            //Result
            //{"data":[{"codOffice":"OC_UY","officeName":"OFICINA COMERCIAL UY","address":"19 DE ABRIL 1,001,FLORIDA,FLORIDA","lng":"-8.425140380859377","fax":"","email":"","lat":"43.36662326918429","telTo24":""}]}
          },
        ], (err, result) => {
          if (!err) {
            if (result.data && result.data.length) {
              let cont = 1;
              let markers = [];
              _.map(result.data, function (item) {
                if (item.lat && item.lng) {
                  markers.push({
                    "type": "Feature",
                    "coordenates_type": "origin",
                    "title": item.officeName,
                    "description": item.address,
                    "geometry": {
                      "type": "Point",
                      "coordinates": [item.lat.toString(), item.lng.toString()]
                    },
                    "properties": {
                      'icon': 'monument',
                      "itemID": `${cont}`
                    }
                  });
                  cont++;
                }
              });
              this.setState({markers});

            } else {
              this.setState({
                spinnerVisible: false,
              }, function () {
                TimerMixin.setTimeout(() => {
                  this.showPopupAlert("Information", 'No data has been found');
                }, 1000);
              });
            }
          }
        }
    );
  };

  onIndexChanged = (index) => {
    if (index === 6) {
      this.setState({renderMap: true, index});
    } else {
      if (this.state.renderMap) {
        this.setState({renderMap: false, index});
      }
    }
  };


  render() {
    return (
        <Container>
          <Header {...this.props} noDrawer
                                  iconAction={'ios-home-outline'}/>

          <SubHeader text={I18n.t("CONTACTS")} back={true} {...this.props}
          />
          <Swiper ref={component => this._swipeInput = component} style={styles.wrapper}
                  scrollEnabled={true}
                  showsButtons={false}
                  onIndexChanged={this.onIndexChanged.bind(this)}
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
                <View style={styles.iconContainer}>
                  <IconFontello name={'phone'} size={50}
                                style={{ color: platformStyle.brandWhite, }}/>
                </View>
                <View style={{ marginTop: 10 }}><Text xlarge primary
                                                      heavy>{I18n.t('PHONE').toUpperCase()}</Text></View>
              </View>
              <Text large dark medium
                    style={styles.textSlide}>{I18n.t('Contact_Telephone')}</Text>
              <Button full rounded onPress={() => OpenAnything.Call(Config.CONTACT_CALL)}
                      style={{ marginTop: 10 }}>
                <Text>{I18n.t('Contact_Telephone_Action')}</Text>
              </Button>
              <Text large dark medium style={styles.textSlide}>{I18n.t('Contact_Telephone_Downside')}</Text>
            </View>

            <View style={styles.slide1}>
              <View style={styles.container}>
                <View style={styles.iconContainer}>

                  <IconFontello name={'sms'} size={40}
                                style={{ color: platformStyle.brandWhite, }}/>
                </View>
                <View style={{ marginTop: 10 }}><Text xlarge primary
                                                      heavy>{"WhatsApp"}</Text></View>
              </View>
              <Text large dark medium style={styles.textSlide}>{I18n.t('Contact_SMS') + Config.CONTACT_TELEPHONE}</Text>
              <Button full rounded onPress={() => OpenAnything.Web(`https://wa.me/${Config.CONTACT_SMS}`)} style={{ marginTop: 10 }}>
                <Text>{I18n.t('Contact_SMS_Action')}</Text>
              </Button>
            </View>

            {/*<View style={styles.slide1}>
              <View style={styles.container}>
                <View style={styles.iconContainer}>

                  <IconFontello name={'sms'} size={40}
                                style={{ color: platformStyle.brandWhite, }}/>
                </View>
                <View style={{ marginTop: 10 }}><Text xlarge primary
                                                      heavy>{Config.CONTACT_USSD}</Text></View>
              </View>
              <Text large dark medium style={styles.textSlide}>{I18n.t('Contact_USSD')} </Text>
              <Button full rounded onPress={() => OpenAnything.Call(encodeURIComponent(Config.CONTACT_USSD))} style={{ marginTop: 10 }}>
                <Text>{I18n.t('Contact_USSD_Action') + Config.CONTACT_USSD}</Text>
              </Button>
            </View>*/}

            <View style={styles.slide1}>
              <View style={styles.container}>
                <View style={styles.iconContainer}>

                  <IconFontello name={'twitter'} size={40}
                                style={{ color: platformStyle.brandWhite, }}/>
                </View>
                <View style={{ marginTop: 10 }}><Text xlarge primary
                                                      heavy>{I18n.t('twitter').toUpperCase()}</Text></View>
              </View>
              <Text large dark medium style={styles.textSlide}>{Config.CONTACT_TWITTER_USER}</Text>
              <Text large dark medium style={styles.textSlide}>{I18n.t('Contact_Twitter')}</Text>

              <Button full rounded
                      onPress={() => OpenAnything.Open(Config.CONTACT_TWITTER_URL)}
                      style={{ marginTop: 10 }}>
                <Text>{I18n.t('Contact_Twitter_Action')}</Text>
              </Button>
            </View>

            <View style={styles.slide1}>
              <View style={styles.container}>
                <View style={styles.iconContainer}>

                  <IconFontello name={'fb'} size={40}
                                style={{ color: platformStyle.brandWhite, }}/>
                </View>
                <View style={{ marginTop: 10 }}><Text xlarge primary
                                                      heavy>{I18n.t('Facebook').toUpperCase()}</Text></View>
              </View>
              <Text large dark medium style={styles.textSlide}>{I18n.t('Contact_Facebook')}</Text>
              <Button full rounded onPress={() => OpenAnything.Open(Config.CONTACT_FACEBOOK)}
                      style={{ marginTop: 10 }}>
                <Text>{I18n.t('Contact_Facebook_Action')}</Text>
              </Button>
            </View>

            <View style={styles.slide1}>
              <View style={styles.container}>
                <View style={styles.iconContainer}>

                  <IconFontello name={'arroba'} size={40}
                                style={{ color: platformStyle.brandWhite, }}/>
                </View>
                <View style={{ marginTop: 10 }}><Text xlarge primary
                                                      heavy>{I18n.t('Email').toUpperCase()}</Text></View>
              </View>
              <Text large dark medium style={styles.textSlide}>{Config.CONTACT_EMAIL}</Text>
              <Text large dark medium style={styles.textSlide}>{I18n.t('Contact_Email')}</Text>
              <Button full rounded
                      onPress={() => OpenAnything.Email(Config.CONTACT_EMAIL, I18n.t('Contact_Email_Subject'), '')}
                      style={{ marginTop: 10 }}>
                <Text>{I18n.t('Contact_Email_Action')}</Text>
              </Button>
            </View>

            <View style={styles.slide1}>
              <View style={styles.container}>
                <View style={styles.iconContainer}>

                  <IconFontello name={'marker'} size={40}
                                style={{ color: platformStyle.brandWhite, }}/>
                </View>
                <View style={{ marginTop: 10 }}><Text xlarge primary
                                                      heavy>{I18n.t('ONESAIT_OFFICES').toUpperCase()}</Text></View>
              </View>
              <Text large dark medium style={styles.textSlide}>{I18n.t('Contact_Offices')}</Text>
              <Text large dark medium style={styles.textSlide}>{I18n.t('Contact_Offices_Line_1')}</Text>
              <Text large dark medium style={styles.textSlide}>{I18n.t('Contact_Offices_Line_2')}</Text>
              <Text large dark medium style={styles.textSlide}>{I18n.t('Contact_Offices_Line_3')}</Text>
              <Text large dark medium style={styles.textSlide}>{I18n.t('Contact_Offices_Line_B1')}</Text>
              <Text large dark medium style={styles.textSlide}>{I18n.t('Contact_Offices_Line_B2')}</Text>
              <Text large dark medium style={styles.textSlide}>{I18n.t('Contact_Offices_Line_B3')}</Text>
              <Button full rounded style={{ marginTop: 10 }} onPress={() => this._swipeInput.scrollBy(1)}>
                <Text>{I18n.t('Contact_Offices_Action')}</Text>
              </Button>
            </View>

            <View style={{ alignSelf: 'center', height: '100%', width: '100%' }}>
              <YellowSubHeader text={I18n.t('ONESAIT_OFFICES')}
                               style={{ flex: 1, height: platformStyle.deviceHeight }}/>
              {this.state.renderMap ?
                  <Map
                      height={platformStyle.platform === "ios" ? 400: platformStyle.deviceHeight-280}
                      renderclusters={false}
                      markers={this.state.markers}
                  /> : null}
            </View>
          </Swiper>
        </Container>
    );
  }
}

//Note: You can either provide an string or an array with latitude and longitude to this method.

Component.propTypes = {};

function bindAction(dispatch) {
  return {};
}

const mapStateToProps = state => ({});

export default connect(mapStateToProps, bindAction)(Contact);

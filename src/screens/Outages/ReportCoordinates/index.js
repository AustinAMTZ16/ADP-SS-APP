import React, {Component} from "react";
import {Image, Keyboard,Platform,PermissionsAndroid } from 'react-native';
// import {request as requestIosPermission, check as checkIosPermission, PERMISSIONS, RESULTS } from 'react-native-permissions';
import {Text, View, Content, Container, Button, Footer, FooterTab} from "native-base";
import {reduxForm, formValueSelector} from "redux-form";
import {connect} from 'react-redux';
import I18n from 'react-native-i18n';

import Header from '../../../components/Header';
import SubHeader from '../../../components/SubHeader';
import sharedStyles from '../../../shared/styles';
import styles from './styles'
import {platformStyle} from "../../../theme";

import Spinner from '../../../components/Spinner';
import {NavigationActions} from 'react-navigation';
import PopupDialog from '../../../components/PopupDialog/';
import Map from '../../Map/';
import TimerMixin from "react-timer-mixin";
import { loadDataListOutages } from '../../../actions/general';


const backAction = NavigationActions.back( {
  key: null
} );
const D=true;//DEBUG

class ReportCoordinates extends Component {

  constructor() {
    super();

    this.state = {
      spinnerVisible: false,
      type: 1,
      markers: [],
      currentPosition: null,
      sendButtonEnabled:false
    };

    this.showPopupAlert = this.showPopupAlert.bind( this );
  }

  componentDidMount(){
    this.askGPSPermission();
  }

  /**
   * Needed to ask GPS permission in this way by an error:
   * https://github.com/facebook/react-native/issues/22535
   */
  askGPSPermission = async () => {
    let hasPermission = true;
    if (Platform.OS === 'android') {
      hasPermission = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      )

      if (!hasPermission) {
        const status = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        )
        hasPermission = status === PermissionsAndroid.RESULTS.GRANTED;

        if (hasPermission) {
          this.onPermissionGranted();
        }else{
         this.onError(I18n.t('LOCATION_PERMISSION_FAILED'));
        }
      }else{
        this.onPermissionGranted();
      }
    } else if (Platform.OS === 'ios') {
      // checkIosPermission(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE)
      // .then(result => {
      //   if (result === RESULTS.GRANTED) {
      //     this.onPermissionGranted();
      //   } else if (result === RESULTS.DENIED) {
      //     requestIosPermission(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE)
      //     .then(result => {
      //       if (result === RESULTS.GRANTED) {
      //         this.onPermissionGranted();
      //       } else {
      //         this.onError(I18n.t('LOCATION_PERMISSION_FAILED'));
      //       }
      //     })
      //     .catch(err => {
      //       this.onError(I18n.t('LOCATION_UNABLE_TO_LOCATE'));
      //     })
      //   } else {
      //     this.onError(I18n.t('LOCATION_PERMISSION_FAILED'));
      //   }
      // })
      // .catch(err => {
      //   this.onError(I18n.t('LOCATION_UNABLE_TO_LOCATE'));
      // })
    }else{
      this.onPermissionGranted();
    }
  }

  onError(message){
    D?console.log("ReportCoordinates -> onError " + message):null;
    TimerMixin.setTimeout(() => {
      this.showPopupAlert(I18n.t("Error"), message, {
        1: {
          key: 'button1',
          text: `${I18n.t('accept')}`,
          action: () => {
            this.props.navigation.dispatch(backAction);
          },
          align: ''
        }
      });
    }, 1000);
  }

  onPermissionGranted(){
    D?console.log("ReportCoordinates -> onPermissionGranted "):null;
    this.setState({ spinnerVisible: true });
    navigator.geolocation.getCurrentPosition(
        (position) => {
          if (position.coords && position.coords.latitude.toString().length && position.coords.longitude.toString().length) {
            D?console.log("ReportCoordinates -> onPermissionGranted Found position"):null;
            let currentPositionMarker = {
              "draggable": true,
              "coordenates_type": "origin",
              "title": I18n.t('REPORT_HERE'),

              "geometry": {
                "type": "Point",
                "coordinates": [position.coords.latitude.toString(), position.coords.longitude.toString()]
              },

              "properties": {
                'icon': 'monument',
                "itemID": 1
              }
            };
            this.setState({
              spinnerVisible: false,
              sendButtonEnabled:true,
              markers: [currentPositionMarker],
              currentPosition: {
                latitude: position.coords.latitude.toString(),
                longitude: position.coords.longitude.toString()
              }
            });
          } else {
            this.setState({spinnerVisible: false});
            this.onError(I18n.t('LOCATION_UNABLE_TO_LOCATE'));
          }
        },
        (err) => {
          this.setState({spinnerVisible: false});
          this.onError(I18n.t('LOCATION_UNABLE_TO_LOCATE'));
        },
        {enableHighAccuracy: false, timeout: 30000, maximumAge: 600000});

  }

  showPopupAlert( title, text, options, content ) {
    this.setState( {
      messageAlert: {
        refresh: new Date().valueOf(),
        outside: false,
        title: title,
        height: 300,
        animation: 2,
        contentText: text,
        content: content,
        options: options ? options : {
            1: {
              key: 'button1',
              text: `${I18n.t( 'Accept' )}`,
              align: ''
            }
          }
      }
    } )
  }


  submit( value ) {
    Keyboard.dismiss();
  }

  onDragEnd(coor){
    this.setState({currentPosition:{latitude:coor.latitude.toString(),longitude: coor.longitude.toString()}});
  }

  render() {
    return (
      <Container>
        <Header {...this.props} noDrawer iconAction={true}/>
        <SubHeader text={I18n.t('ReportOutagesCoor')} back {...this.props}/>

        <PopupDialog refModal={this.state.messageAlert}/>

        <Content>
          <Map
            onDragEnd={(coor) => {this.onDragEnd(coor)}}
            renderclusters={false}
            markers={this.state.markers}
          />
        </Content>
        <Spinner visible={this.state.spinnerVisible} textContent={I18n.t('Loading')}
                 overlayColor={`rgba(0, 0, 0, 0.60)`}
                 textStyle={{ color: '#FFF' }}/>

        <Footer noBorders padder>
          <FooterTab>
            <Button style={{backgroundColor: platformStyle.brandPrimary}}
                    block
                    disabled={!this.state.sendButtonEnabled}
                    rounded
                    onPress={() =>{
                      this.props.navigation.state.params.onGoBack(this.state.currentPosition);
                      this.props.navigation.goBack();
                    }}
            >
              <Text sizeNormal> {I18n.t( 'Submit' )}</Text>
            </Button>
          </FooterTab>
        </Footer>
      </Container>
    );
  }
}

const ReportCoordinatesPage = reduxForm( {
  form: "ReportOutagesCoordinatesForm"
} )( ReportCoordinates );

function bindAction( dispatch ) {
  return {
    loadDataListOutages: ( formData ) => dispatch(loadDataListOutages()),
  };
}

const selector = formValueSelector( 'ReportOutagesCoordinatesForm' );
const mapStateToProps = state => {
  return {
    dataForm: selector( state, 'account', 'meter', 'typeComplaint' ),
  }
};

export default connect( mapStateToProps,bindAction )( ReportCoordinatesPage );

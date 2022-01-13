import React, { Component } from "react";
import {  Keyboard, PermissionsAndroid, Image } from 'react-native';
import {
  Text,
  Button,
  Content,
  Container,
  View,
  Icon
} from "native-base";
import I18n from 'react-native-i18n';
import { Field, reduxForm } from "redux-form";
import { connect } from 'react-redux';
import ImagePicker from 'react-native-image-picker';

import Header from '../../../components/Header';
import YellowSubHeader from '../../../components/YellowSubHeader';
import SubMenu from '../SubMenu';
import FormField from '../../../components/FormField/';
import errorStyles from '../../../components/FormField/styles';
import { required } from '../../../shared/validations';
import {platformStyle} from "../../../theme";
import sharedStyles from '../../../shared/styles';
import generalService from "../../../services/general/generalService";
import waterfall from "async/waterfall";
import repo from '../../../services/database/repository'
import Spinner from '../../../components/Spinner';
import { NavigationActions } from 'react-navigation'
import PopupDialog from '../../../components/PopupDialog/';
import firebaseService from "../../../services/firebase/firebaseService";
import TimerMixin from "react-timer-mixin";
import moment from "moment";
import _ from "lodash";
import eachSeries from 'async/eachSeries'

const backAction = NavigationActions.back({
  key: null
});


const equalToActiveEnergy = ( value, allValues, props, name ) => {
  let items = name.split('_');
  let item = items[ items.length - 1 ];
  return value === allValues[ `consumType_${item}` ] ? undefined : `This field should be equal`
};

class RegisterSelfReading extends Component {
  constructor( props ) {
    super(props);

    this.state = {
      data: null,
      coords: null,
      hasSelfRead: null,
      plannedReadDate: null,
      photos: [],
    };
  }


  componentDidMount() {
    firebaseService.supervisorAnalytic('SELFREADING');

    this.loadData();
  }

  loadData() {
    let dataSelfReading = null;
    waterfall([
      ( callback ) => {
        this.setState({ spinnerVisible: true });
        let idPaymentForm = repo.configuration.getField('idPaymentForm');
        generalService.getSelfReaderAction(idPaymentForm, callback);
      },
      ( arg1, callback ) => {

        dataSelfReading = arg1;
        let accountServices = JSON.parse(repo.configuration.getField('accountServices'));
        let idPaymentForm = repo.configuration.getField('idPaymentForm');
        generalService.getSelfReaderPeriodAction(idPaymentForm, callback);
      },

    ], ( err, result ) => {

      this.setState({ spinnerVisible: false }, function() {
        if( !err ) {
          let plannedReadDate = null;
          if( result ) {
            plannedReadDate = (result && result.plannedReadDate) ? result.plannedReadDate : null;
          }
          let idService = (dataSelfReading.data && dataSelfReading.data.length && dataSelfReading.data[ 0 ].idService ) ? dataSelfReading.data[ 0 ].idService : null;

          this.setState({
            data: dataSelfReading.data,
            hasSelfRead: dataSelfReading.hasSelfRead,
            idService,
            plannedReadDate
          });
        } else {
          TimerMixin.setTimeout(() => {
            this.showPopupAlert(I18n.t("INFO"), I18n.t("HAS_ERROR_RETRY"));
          }, 1000);
        }
      });
    })

  }

  getGeo() {
    navigator.geolocation.getCurrentPosition(
      ( position ) => {

        if( position.coords.latitude && position.coords.longitude ) {
          this.setState({ coords: position.coords });
        }
      },
      ( error ) => {

      },
      { enableHighAccuracy: true, timeout: 60000, maximumAge: 0 });
  }

  submit( values ) {
    Keyboard.dismiss();
    this.showPopupAlert(I18n.t("QUESTION"), 'Are you sure you want to send your self-reading?', null, {
      1: {
        key: 'button1',
        text: `${I18n.t('accept')}`,
        action: () => this.sendData(values),
        align: ''
      },
      2: {
        key: 'button2',
        text: `${I18n.t('Cancel')}`,
        align: ''
      }
    });

  }

  sendData( values ) {

    this.setState({ spinnerVisible: true });
    eachSeries(this.state.data, ( item, callback ) => {
      let dataObj = { idService: this.state.idService, readings: [] };
      let dataObjPhoto = {};

      let value = values[ `consumType_${item.consumType}-${item.numMeter}` ];
      let reading = value.split(".");
      reading = reading[ 0 ];
      reading = reading.match(/\d/g);
      reading = reading.join("");

      dataObj.readings.push({
        serialNum: item.numMeter,
        consumType: item.consumType,
        readingValue: reading,
        // indSelfRead: true,
        // readingDate: new  Date().valueOf()
      });

      waterfall([
        ( callback1 ) => {
          let idPaymentForm = repo.configuration.getField('idPaymentForm');
          generalService.postSelfReaderAction(dataObj, idPaymentForm, callback1);
        },
        ( arg1, callback1 ) => {

          if( values && values[ `photo_${item.consumType}-${item.numMeter}` ] ) {
            dataObjPhoto = {
              "latitudeDegrees": (this.state.coords && this.state.coords.latitude) ? this.state.coords.latitude.toString() : "0.0",
              "longitudeDegrees": (this.state.coords && this.state.coords.longitude) ? this.state.coords.longitude.toString() : "0.0",
              "photo": values[ `photo_${item.consumType}-${item.numMeter}` ].data,
              "photoName": values[ `photo_${item.consumType}-${item.numMeter}` ].fileName,
              "serialNum": item.numMeter
            };
            //TODO
            // generalService.postSelfReaderPhotoAction(dataObjPhoto, callback1);
            return callback1(null, 'OK');
          } else {
            return callback1(null, 'OK');
          }

        },

      ], ( err, result ) => {
        if( !err ) {
          return callback();
        } else {
          if( err === 'ERROR-PHOTO' )
            return callback();
          else
            return callback(err);
        }


      });


    }, ( err ) => {

      if( !err ) {
        this.setState({ spinnerVisible: false }, function() {
          TimerMixin.setTimeout(() => {
            this.showPopupAlert(I18n.t("INFO"), I18n.t("OPERATION_SUCCESS2"), null, {
              1: {
                key: 'button1',
                text: `${I18n.t('accept')}`,
                action: () => this.props.navigation.dispatch(backAction),
                align: ''
              }
            });

          }, 1000);
        });

      } else {
        this.setState({ spinnerVisible: false }, function() {
          TimerMixin.setTimeout(() => {
            this.showPopupAlert(I18n.t("INFO"), I18n.t("HAS_ERROR_RETRY"), null, {
              1: {
                key: 'button1',
                text: `${I18n.t('accept')}`,
                action: () => this.props.navigation.dispatch(backAction),
                align: ''
              }
            });

          }, 1000);
        });
      }


    });

  }


  /**
   *
   * @param title
   * @param text
   * @param content
   * @param options
   */
  showPopupAlert( title, text, content, options ) {
    this.setState({
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
            text: `${I18n.t('accept')}`,
            align: ''
          }
        },
      }

    })
  }


  selectPhotoTapped( numMeter, consumType ) {
    const options = {
      title: null,
      takePhotoButtonTitle: I18n.t('TakePhoto'),
      // chooseFromLibraryButtonTitle: I18n.t('SelectPhoto'),
      chooseFromLibraryButtonTitle: null,
      quality: 0.8,
      maxWidth: 400,
      maxHeight: 400,
      storageOptions: {
        skipBackup: true
      }
    };

    // Launch Camera:
    ImagePicker.launchCamera(options, ( response ) => {
      // ImagePicker.launchCamera(options, ( response ) => {

      if( response.didCancel ) {
        //console.log('User cancelled photo picker');
      }
      else if( response.error ) {
        //console.log('ImagePicker Error: ', response.error);
      }
      else if( response.customButton ) {
        //console.log('User tapped custom button: ', response.customButton);
      }
      else {

        // save
        let fotos = this.state.photos;
        const value = {
          numMeter,
          fileName: response.fileName,
          path: response.path,
          data: response.data
        };
        fotos.push(value);
        this.props.change(`photo_${consumType}-${numMeter}`, value);
        this.getGeo();
        this.setState(fotos);
      }
    });
  }


  requestPermission = async ( numMeter ) => {

    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          'title': 'Camera Permissions',
          'message': 'Please allow us to use the camera?'
        }
      );
      if( granted === PermissionsAndroid.RESULTS.GRANTED ) {
        this.selectPhotoTapped(numMeter, consumType);
      } else {
        console.log("Camera permission denied");
      }
    } catch( err ) {

      console.log('hasPermission-requestPermission-err', err);
    }
  };

  hasPermission = async () => {

    try {
      return await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.CAMERA);
    } catch( err ) {
      console.log('ERROR', 'hasPermission-hasPermission');
      //console.warn(err, 'PERMISSION CHECK');
    }
  };

  checkPermissionAndOpen = ( numMeter, consumType ) => {

    if( platformStyle.platform == 'ios' ) {
      this.selectPhotoTapped(numMeter, consumType);
    } else {
      this.hasPermission().then(( hasPermission ) => {

        if( hasPermission ) {

          this.selectPhotoTapped(numMeter, consumType);
        } else {
          this.requestPermission(numMeter, consumType);
        }
      });
    }

  };

  renderMeter() {
    {
      return this.state.data.map(( item, index ) => {

        let photo = _.find(this.state.photos, function( o ) { return o.numMeter === item.numMeter; });
        if( photo && _.isObject(photo) )
          photo = `file://${photo.path}`;

        return (
          <View key={item.numMeter} style={{ marginBottom: 30 }}>
            <Text sizeNormal heavy style={sharedStyles.margin('bottom', 3)}>Meter Number {item.numMeter}</Text>

            <Field name={`consumType_${item.consumType}-${item.numMeter}`}
                   component={FormField}
                   keyboardType="numeric"
                   errorActive
                   inputLabel={`${item.consumTypeDesc} (${item.units})`}
                   validate={[ required ]}
                   underline
                   light
            />
            <Field name={`confirmConsumType_${item.consumType}-${item.numMeter}`}
                   component={FormField}
                   errorActive
                   keyboardType="numeric"
                   inputLabel={`Confirm ${item.consumTypeDesc} (${item.units})`}
                   validate={[ required, equalToActiveEnergy ]}
                   underline
                   light
            />
            {photo ?
              <View style={{ marginVertical: 5 }}>
                <Image source={{ uri: photo }} style={{ height: 100 }}/>
              </View> : null}

            <Field name={`photo_${item.consumType}-${item.numMeter}`}
                   component={( { meta } ) => {
                     return <View>
                       <View style={{ flexDirection: 'row' }}>
                         <View flex05>
                           <Button style={{backgroundColor: platformStyle.brandPrimary}}
                             roundedCircleMedium
                             onPress={() => this.checkPermissionAndOpen(item, index)}>
                             <Icon name="md-camera" style={{ fontSize: 40 }}/>
                           </Button>
                         </View>
                         <View flex15>
                           <Text style={sharedStyles.textAlign('justify')}>
                             Take a picture of your meter and meter reading, to facilitate KPLC with additional location
                             information,
                             allowing us to provide you with prompt assistance when necessary
                           </Text></View>
                       </View>
                       <View style={errorStyles.labelError}>
                         {meta.touched && meta.error
                           ? <Text style={errorStyles.formErrorText1}>
                             {meta.error}
                           </Text>
                           : <Text style={errorStyles.formErrorText2}>error here</Text>}
                       </View>
                     </View>
                   }}
                   validate={[]}
            />
          </View>
        )
      })
    }
  }

  render() {
    return (
      <Container>
        <Header noDrawer {...this.props}
                iconAction={'ios-home-outline'}/>
        <SubMenu title={I18n.t('METER_READING')} noMenu leftIcon="md-close" {...this.props}/>
        <YellowSubHeader text={I18n.t('Postpayment_Electricity')}/>
        <PopupDialog
          refModal={this.state.messageAlert}
        />
        {(this.state.data && this.state.hasSelfRead) ?
          <Content padderHorizontal>
            {this.renderMeter()}
            <View style={{ marginVertical: 10, marginBottom: 20 }}>
              <Button block rounded style={{backgroundColor: platformStyle.brandPrimary}} onPress={this.props.handleSubmit(this.submit.bind(this))}>
                <Text sizeNormal>{I18n.t('SAVE')}</Text>
              </Button>
            </View>
          </Content> : null}

        {this.state.data ?
          <Text style={sharedStyles.textAlign('center')}></Text> : null}

        {(this.state.data && !this.state.hasSelfRead ) ?
          <Text dark medium style={sharedStyles.textAlign('center')}>
        	I18n.t('READING_CLOSED')
          </Text> : null}
        <Text/>
        {(this.state.data && !this.state.hasSelfRead && this.state.plannedReadDate ) ?
          <Text dark medium style={sharedStyles.textAlign('center')}>
            Schedule
            for: {this.state.plannedReadDate ? `${moment(this.state.plannedReadDate).format("DD/MM/YYYY")}` : ''}
          </Text>
          : null}

        <Spinner visible={this.state.spinnerVisible} textContent={I18n.t('Loading')}
                 overlayColor={`rgba(0, 0, 0, 0.60)`}
                 textStyle={{ color: '#FFF' }}/>


      </Container>
    );
  }
}

export default reduxForm({
  form: "AccountRegisterSelfReadingForm",
})(RegisterSelfReading);

import React, { Component } from "react";
import {
  Image,
  TouchableOpacity,
  Keyboard,
  Animated,
} from "react-native";
import { Text, View, Content, Container, Icon, Button, Footer, FooterTab } from "native-base";
import I18n from 'react-native-i18n';
import { Field, reduxForm } from "redux-form";
import { connect } from 'react-redux';
import ImagePicker from 'react-native-image-picker';

import PopupDialog from '../../../components/PopupDialog/';
import { loadDataFormPersonalInfo, loadFormErrorsPersonalInfo } from '../../../actions/general'
import Header from '../../../components/Header';
import SubHeader from '../../../components/SubHeader';
import Tabs from '../Tabs';
import FormField from '../../../components/FormField/'
import FormPicker from '../../../components/FormPicker/'
import Checkbox from '../../../components/Checkbox/'
import FormPickerDate from '../../../components/FormPickerDate/'
import { required, generateDate, validateDocNumber, formatLocaleDate } from '../../../shared/validations';
import sharedStyles from '../../../shared/styles';
import {platformStyle} from "../../../theme";
import styles from './styles'
import IconFontello from '../../../components/IconFontello/';
import repo from '../../../services/database/repository'
import waterfall from "async/waterfall";
import generalService from "../../../services/general/generalService";
import Spinner from '../../../components/Spinner';
import * as Animatable from 'react-native-animatable';
import moment from 'moment-timezone';
import TimerMixin from "react-timer-mixin";
import {createAlert} from '../../../components/ScreenUtils';
import bannerService from "../../../services/general/bannerService";
import {NavigationActions} from 'react-navigation';

const backAction = NavigationActions.back({
  key: null
});

class MyDataPersonalInformation extends Component {
  constructor() {
    super();
    this.headerHeight = platformStyle.platform === 'ios' ? platformStyle.deviceHeight / 7 : platformStyle.deviceHeight / 8;
    this.headerHeight = this.headerHeight + 110;
    this.state = {
      showHeader: true,
      spinnerVisible: false,
      data: null,
      active: false,
      showState: true,
      genderTypes: [],
      typeStreets: [],
      documTypes: [],
      startHeightView: new Animated.Value(this.headerHeight),
      showSaveButton:true
    }
    // this.SelectPhoto = this.SelectPhoto.bin(this);
  }

  componentDidMount() {
    let adpProgram = repo.configuration.getField('adpProgramData');
    let program = null;
    if(adpProgram!=null && adpProgram.length){
      program = JSON.parse(adpProgram);
    }

    let data = JSON.parse(repo.configuration.getField('customerData'));
    if(data.birthDate){
      data.birthDate = formatLocaleDate(data.birthDate);
    }else{
      data.birthDate = null;
    }

    let typeStreet = JSON.parse(repo.configuration.getField('typeStreet'));
    let typeStreets = _.map(typeStreet, function( item ) {
      return { code: item.codDevelop, val: item.nameType }
    });
    let genderType = JSON.parse(repo.configuration.getField('genderType'));
    let genderTypes = _.map(genderType, function( item ) {
      return { code: item.codDevelop, val: item.nameType }
    });
    let documType = JSON.parse(repo.configuration.getField('documType'));
    let documTypes = _.map(documType, function( item ) {
      return { code: item.codDevelop, val: item.nameType }
    });

    this.setState({
      genderTypes,
      typeStreets,
      documTypes,
      program,
      showSaveButton:program==null
    }, function() {
      this.props.loadDataFormPersonalInfo(data);
    }.bind(this));

    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow.bind(this));
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide.bind(this));
  }

  componentWillReceiveProps( nextProps ) {
    if( nextProps.errors && this.props.errorsDate !== nextProps.errorsDate ) {
      this.showPopupAlert1();
    }
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  navigateToScreen(){
    if(this.state.program!=null){
        if(this.state.program.screen2!="ADHERE_DIRECTLY"){
          TimerMixin.setTimeout(() => {
            this.props.navigation.navigate(this.state.program.screen2);
          }, 1000);
        }else{
          this.adhereProgram();
        }
    }
  }

  adhereProgram() {
    this.setState({
      spinnerVisible: true
    });

    let req2 = {
      "idPaymentForm": repo.configuration.getField('idPaymentFormSelected'),
      "programType": this.state.program.type
    };
    bannerService.addProgramSubscriber(req2, (err, result) => {
      if(!err){
        let options =  {
          1: {
            key: 'button1',
            text: `${I18n.t('accept')}`,
            action: () => {
              TimerMixin.setTimeout(() => {
                this.props.navigation.dispatch(backAction);
              }, 500);
            },
            align: ''
          }
        };
        TimerMixin.setTimeout(() => {
          this.setState({messageAlert: createAlert(I18n.t("PROGRAM_INFO_ADP"), I18n.t("PROGRAM_SUSCRIBE_DONE").replace("{program}",this.state.program.title),options),spinnerVisible: false})
        }, 500);
      }else{
        TimerMixin.setTimeout(() => {
          this.setState({...err,spinnerVisible: false})
        }, 500);
      }
    });
  }

  showPopupAlert1() {
    this.setState({
      messageAlert: {
        refresh: new Date().valueOf(),
        outside: false,
        title: I18n.t('Alert'),
        height: 200,
        animation: 2,
        contentText: I18n.t('ALL_FIELDS'),
        content: null,
        options: {
          1: { key: 1, text: I18n.t('OK') }
        },
      }
    })
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

  _keyboardDidShow() {
    Animated.timing(                  // Animate over time
      this.state.startHeightView,            // The animated value to drive
      {
        toValue: 0,                   // Animate to opacity: 1 (opaque)
        duration: 300,              // Make it take a while
      }
    ).start();
    this.header.slideOutUp(300);
  }

  _keyboardDidHide() {
    Animated.timing(                  // Animate over time
      this.state.startHeightView,            // The animated value to drive
      {
        toValue: this.state.showState ? this.headerHeight : this.headerHeight - 60,                   // Animate to opacity: 1 (opaque)
        duration: 300,              // Make it take a while
      }
    ).start();
    this.header.slideInDown(300);

  }

  selectPhoto() {
    this.showPopupAlert(I18n.t("PROFILE_IMAGE"), I18n.t("MSG016"), null,
      {
        1: {
          key: 'button1',
          text: `${I18n.t('TakePhoto')}`,
          action: () => this.pickerPhoto('launchCamera'),
          align: ''
        },
        2: {
          key: 'button2',
          text: `${I18n.t('SelectPhoto')}`,
          action: () => this.pickerPhoto('launchImageLibrary'),
          align: ''
        }
      });
  }

  pickerPhoto( actionType ) {
    const options = {
      title: I18n.t("PROFILE_IMAGE"),
      takePhotoButtonTitle: I18n.t('TakePhoto'),
      chooseFromLibraryButtonTitle: I18n.t('SelectPhoto'),
      quality: 1.0,
      maxWidth: 500,
      maxHeight: 500,
      storageOptions: {
        skipBackup: true
      }
    };
    if( actionType === 'launchCamera' ) {
      ImagePicker.launchCamera(options, ( response ) => {
    	  /**
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
        }**/
      });
    } else {
      ImagePicker.launchImageLibrary(options, ( response ) => {
    	  /**
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
        }**/
      });
    }

  }

  activeForm() {
    this.setState({ active: !this.state.active, })
  }

  showMenu( showState ) {
    this.setState({
      showState,
      startHeightView: !showState ? new Animated.Value(this.headerHeight - 60) : new Animated.Value(this.headerHeight)
    })
  }


  submit( values ) {

    waterfall([
      ( callback ) => {
        this.setState({ spinnerVisible: true, active: false });
        let idCustomer = repo.configuration.getField('idCustomer');
        let birth;
        if(values.birthDate){
          birth = moment(generateDate(values.birthDate).getTime()).format("YYYY-MM-DD");
        }else{
          birth=null;
        }

    	let objData = {
          name: values.name,
          surname1: values.surname1,
          surname2: values.surname2,
          birthDate: birth,
          codSex: values.codSex,

        };
        generalService.sendCustomerDataAction(idCustomer, objData, callback);

      },


    ], ( err, result ) => {
      this.setState({ spinnerVisible: false },
        function() {
          if( !err ) {

            TimerMixin.setTimeout(() => {
              this.showPopupAlert(I18n.t("INFO"), I18n.t("DATA_REFERENCE") + result.reference,null,{
                1: {
                  key: 'button1',
                  text: `${I18n.t('accept')}`,
                  //action: () => this.navigateToScreen(),
                  align: ''
                }
              });
            }, 1000);
          } else {
            TimerMixin.setTimeout(() => {
              this.showPopupAlert("Error", err);
            }, 1000);
          }
        });
    })
  }

  render() {
    let userEmail = repo.configuration.getField('user_username');
    userEmail = userEmail ? userEmail.replace('%23', '@') : '';

    return (
      <Container>
        <PopupDialog
          refModal={this.state.messageAlert}
        />

        <Animated.View                 // Special animatable View
          style={{
            height: this.state.startHeightView,         // Bind opacity to animated value
          }}
        >
          <Animatable.View
            ref={( ref ) => this.header = ref}
          >
            <Header
              noDrawer
              iconAction={true}
              {...this.props}
            />
            <SubHeader text={I18n.t('MyData')} back={true}
                       showMenu={this.showMenu.bind(this)}
                       menu={{
                         icon: 'ios-list-outline', isOpened: true,
                         items:
                           <TouchableOpacity style={styles.menu.item}
                                             onPress={this.activeForm.bind(this)}>
                             <IconFontello name={'edit'} style={styles.menu.iconMenu}/>
                             {this.state.active ?
                               <Text white sizeNormal>{I18n.t('CANCEL_PERSONAL_INFO')}</Text> :
                               <Text white sizeNormal>{I18n.t('EDIT_PERSONAL_INFO')}</Text>}
                           </TouchableOpacity>
                       }} {...this.props} />
          </Animatable.View>
        </Animated.View>
        <Tabs {...this.props}/>

        <Content padderHorizontal>

          <Field name="name"
                 component={FormField}
                 editable={this.state.active}
                 errorActive
                 inputLabel={I18n.t('CustomerName')}
                 validate={[ required ]}
                 light
                 inputProps={{
                   returnKeyType: 'next',
                   onSubmitEditing: () => this.surname1._root.focus()
                 }}
          />
          <Field name="surname1"
                 component={FormField}
                 editable={this.state.active}
                 errorActive
                 inputLabel={I18n.t('surname1')}
                 validate={[ required ]}
                 light
                 inputProps={{
                    returnKeyType: 'next',
                   ref: c => (this.surname1 = c),
                   onSubmitEditing: () => this.surname2._root.focus()
                 }}
          />
          <Field name="surname2"
                 component={FormField}
                 editable={this.state.active}
                 errorActive
                 inputLabel={I18n.t('surname2')}
                 light
                 inputProps={{
                  ref: c => (this.surname2 = c)
                 }}
          />
          <Field name="docType"
                 disabled={true}
                 component={FormPicker}
                 editable={false}
                 validationActive
                 inputLabel={I18n.t('DocumentType')}
                 borderBottomStyle
                 errorActive
                 dataItems={this.state.documTypes.length ? this.state.documTypes : null}
          />

          <Field name="docNumber"
                 component={FormField}
                 disabled={true}
                 editable={false}
                 errorActive
                 inputLabel={I18n.t('Document_Number')}
                 light
          />

          <Field name="codSex"
                 disabled={!this.state.active}
                 component={FormPicker}
                 editable={this.state.active}
                 validationActive
                 inputLabel={I18n.t('Gender')}
                 borderBottomStyle
                 errorActive
                 dataItems={this.state.genderTypes.length ? this.state.genderTypes : null}
          />

          <Field name="birthDate"
                 disabled={!this.state.active}
                 component={FormPickerDate}
                 dataFormat={repo.configuration.getField("language") == "es" ? "DD/MM/YYYY" : "MM/DD/YYYY"}
                 label={I18n.t('Date_of_Birth')}
                 width={platformStyle.deviceWidth - 100}
                 icon="md-calendar"
                 clearActive={true}                
                 errorActive
                 stylesGrp={{
                   borderTopWidth: 0,
                   borderLeftWidth: 0,
                   borderRightWidth: 0,
                 }}
          />

          <View style={sharedStyles.padding('top', 2)}>
            {this.state.active ? <Field name="termsConditions"
                component={Checkbox}
		            label={<Text sizeNormal
		                         style={{ ...sharedStyles.margin('left', 2), width: platformStyle.deviceWidth - 60 }}>
		              {I18n.t('MSG003')}{' '}
		              <Text style={{ textDecorationLine: 'underline' }}
		                    onPress={() => {
		                      if(this.state.program && this.state.program.url){		                       
		                        this.props.navigation.navigate('TermsConditions',{url:this.state.program.url});
		                      }else{		                        
		                        this.props.navigation.navigate('TermsConditions');
		                      }
		                    }}>
		                {I18n.t('Terms_and_Conditions')}
		              </Text>
		            </Text>
		            }
		            editable={true}
		            validate={[ required ]}
		            {...this.props}
            />:null}
          </View>

          <View style={sharedStyles.padding('bottom')}>
            {this.state.active && platformStyle.platform === 'ios' ?
              <Button block rounded style={{...styles.loginBtn, backgroundColor: platformStyle.brandPrimary}} onPress={this.props.handleSubmit(this.submit.bind(this))}>
                <Text sizeNormal>{I18n.t('SAVE')}</Text>
              </Button> : null
            }

            {this.state.active && platformStyle.platform === 'ios' && this.state.showSaveButton==false ?
                <Button block rounded style={{...styles.loginBtn, backgroundColor: platformStyle.brandPrimary}} onPress={this.props.handleSubmit(this.navigateToScreen.bind(this))}>
                  <Text sizeNormal>{I18n.t('PROGRAM_SAVE_CONTINUE')}</Text>
                </Button>
            :null}
          </View>
        </Content>
        <Spinner visible={this.state.spinnerVisible} textContent={I18n.t('Loading')}
                 overlayColor={`rgba(0, 0, 0, 0.60)`}
                 textStyle={{ color: '#FFF' }}/>
        {this.state.active && platformStyle.platform === 'android' ?
          <Footer noBorders padder>
            <FooterTab>
              <Button block rounded style={{...styles.loginBtn, backgroundColor: platformStyle.brandPrimary}} onPress={this.props.handleSubmit(this.submit.bind(this))}>
                <Text sizeNormal>{I18n.t('SAVE')}</Text>
              </Button>

              {this.state.showSaveButton==false ?
                  <Button block rounded style={{...styles.loginBtn, backgroundColor: platformStyle.brandPrimary}} onPress={this.props.handleSubmit(this.navigateToScreen.bind(this))}>
                    <Text sizeNormal>{I18n.t('PROGRAM_SAVE_CONTINUE')}</Text>
                  </Button>
               :null}
            </FooterTab>
          </Footer> : null}
      </Container>
    );
  }
}

const MyDataPersonalInformationPage = reduxForm({
  form: "MyDataPersonalInformationForm",
  onSubmitFail: ( result, dispatch ) => {
    dispatch(loadFormErrorsPersonalInfo(result))
  },
  onSubmitSuccess: ( result, dispatch ) => {
    dispatch(loadFormErrorsPersonalInfo(null))
  },
  enableReinitialize: true,
})(MyDataPersonalInformation);

function bindAction( dispatch ) {
  return {
    loadDataFormPersonalInfo: ( formData ) => dispatch(loadDataFormPersonalInfo(formData)),
  };
}



// const selector = formValueSelector('MyDataPersonalInformationForm');
const mapStateToProps = state => {
  return {
    // dataForm: selector(state, 'indSelfReader', 'email', 'termsConditions'),
    initialValues: state.generalReducer.formDataPersonalInfo,
    errors: state.generalReducer.formErrorsPersonalInfo,
    errorsDate: state.generalReducer.formErrorsPersonalInfoDate,
  }
};

export default connect(mapStateToProps, bindAction)(MyDataPersonalInformationPage);


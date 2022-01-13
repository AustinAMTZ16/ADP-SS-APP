import React, { Component } from "react";
import { Image, TouchableOpacity, Animated, Keyboard } from "react-native";
import { Text, Content, Container, Footer, FooterTab, Button } from "native-base";
import I18n from 'react-native-i18n';
import { Field, reduxForm, formValueSelector } from "redux-form";
import { connect } from 'react-redux';

import { loadDataFormContactInfo } from '../../../actions/general'
import Header from '../../../components/Header';
import SubHeader from '../../../components/SubHeader';
import Tabs from '../Tabs';
import FormField from '../../../components/FormField/';
import { required, email, equalTo,phoneNumber } from '../../../shared/validations';
import sharedStyles from '../../../shared/styles';
import {platformStyle} from "../../../theme";
import styles from './styles'
import generalService from "../../../services/general/generalService";
import IconFontello from '../../../components/IconFontello/';
import repo from '../../../services/database/repository'
import Spinner from '../../../components/Spinner';
import * as Animatable from 'react-native-animatable';
import firebaseService from "../../../services/firebase/firebaseService";
import PopupDialog from '../../../components/PopupDialog/';
import TimerMixin from "react-timer-mixin";
import waterfall from "async/waterfall";
import {createAlert} from '../../../components/ScreenUtils';


const equalToEmail = equalTo('email', 'email');

class MyDataContactInformation extends Component {
  constructor() {
    super();
    this.headerHeight = platformStyle.platform === 'ios' ? platformStyle.deviceHeight / 7 : platformStyle.deviceHeight / 8;
    this.headerHeight = this.headerHeight + 110;
    let phonePlaceHolder = I18n.t('phonePlaceHolder');
    
    this.state = {
      showHeader: true,
      active: false,
      emailChanged:false,
      showState: true,
      spinnerVisible: false,
      parent: null,
      data: [],
      startHeightView: new Animated.Value(this.headerHeight),
      phonePlaceHolder
    }
  }

  componentDidMount() {
    firebaseService.supervisorAnalytic('MYDATA');

    let data = JSON.parse(repo.configuration.getField('customerData'));
    this.props.loadDataFormContactInfo(data);
    if( platformStyle.platform === 'ios' ){
      this.setState({
        keyboardType:  "numbers-and-punctuation"
      });
    }else{
      this.setState({
        keyboardType:  "phone-pad"
      });
    };
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow.bind(this));
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide.bind(this));

  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  componentWillReceiveProps( nextProps ) {
    if( this.props.dataForm !== nextProps.dataForm ) {
      if( this.props.dataForm.email !== nextProps.dataForm.email && this.props.dataForm.email ) {
        this.setState({ emailChanged: true });
      }
    }
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
        toValue: this.state.showState ? this.headerHeight : this.headerHeight - 60,
        duration: 300,              // Make it take a while
      }
    ).start();
    this.header.slideInDown(300);

  }

  activeForm() {
    this.setState({ active: !this.state.active})
  }
  showMenu( showState ) {
    this.setState({
      showState,
      startHeightView: !showState ? new Animated.Value(this.headerHeight - 60) : new Animated.Value(this.headerHeight)
    })
  }

  submit( values ) {
	  
	  this.setState({ spinnerVisible: true });
	  let idCustomer = repo.configuration.getField('idCustomer');
	  var objData = {
		  email: values.email,

		  phone1: /^\+\d{1,3}\s\d{9,10}$/.test(values.phone1) ? values.phone1 :
       /^\d{9,10}$/.test(values.phone1) ? `+52 ${values.phone1}` : '',

		  phone2: /^\+\d{1,3}\s\d{9,10}$/.test(values.phone2) ? values.phone2 :
       /^\d{9,10}$/.test(values.phone2) ? `+52 ${values.phone2}` : '',
	  };

      waterfall([
        (callback ) => {
          let idCustomer = repo.configuration.getField('idCustomer');
          generalService.sendCustomerAction(idCustomer, objData, callback);
        }
      ], ( err, result ) => {

        if(!err){
            let data = JSON.parse(repo.configuration.getField('customerData'));
            data.email = objData.email;
            data.phone1 = objData.phone1;
            data.phone2 = objData.phone2;
            repo.configuration.setField('customerData', JSON.stringify(data));
            this.setState({
              spinnerVisible: false,
              emailChanged:false, active:false
            });
            TimerMixin.setTimeout(() => {
                this.setState({
                    messageAlert: createAlert(I18n.t("INFO"), I18n.t("CONTACT_DATA_REFERENCE"))
                });
            }, 1000);
        }else{
          this.setState({ spinnerVisible: false }, function() {
            TimerMixin.setTimeout(() => {
              this.setState(err)
            }, 1000);
          }.bind(this));
        }
      });
  };

  


  render() {

    return (
      <Container>
        <Animated.View                 // Special animatable View
          style={{
            height: this.state.startHeightView,         // Bind opacity to animated value
          }}
        >
          <Animatable.View
            ref={( ref ) => this.header = ref}
          >
            <Header {...this.props}
              noDrawer
              iconAction={true}/>
            <SubHeader text={I18n.t('MyData')} back={true} {...this.props}
                       showMenu={this.showMenu.bind(this)}
                       menu={{
              icon: 'ios-list-outline', isOpened: true,
              items:
                <TouchableOpacity style={styles.menu.item}
                                  onPress={this.activeForm.bind(this)}>
                  <IconFontello name={'edit'} style={styles.menu.iconMenu}/>
                  {this.state.active ?
                    <Text white sizeNormal>{I18n.t('CANCEL_EDIT_INFO')}</Text> :
                    <Text white sizeNormal>{I18n.t('EDIT_INFO')}</Text>}
                </TouchableOpacity>
            }}/>
          </Animatable.View>
        </Animated.View>
        <Tabs {...this.props}/>

        <PopupDialog refModal={this.state.messageAlert}/>

        <Content padderHorizontal>
          <Field name="phone1"
                 editable={this.state.active}
                 component={FormField}
                 errorActive
                 inputLabel={I18n.t('PHONE1')}
                 validate={[ required,phoneNumber ]}
                 placeholder={this.state.phonePlaceHolder}
                 light
                 keyboardType =  {this.state.keyboardType}
                 inputProps={{
                   returnKeyType: 'next',
                   onSubmitEditing: () => this.email._root.focus(),
                 }}
          />
          <Field name="phone2"
                 editable={this.state.active}
                 component={FormField}
                 errorActive
                 inputLabel={I18n.t('PHONE2')}
                 light
                 placeholder={this.state.phonePlaceHolder}
                 validate={[ phoneNumber ]}
                 keyboardType="phone-pad"
                 inputProps={{
                   returnKeyType: 'next',
                   onSubmitEditing: () => this.email._root.focus(),
                 }}
          />
          <Field name="email"
                 editable={this.state.active}
                 component={FormField}
                 errorActive
                 inputLabel={I18n.t('Email')}
                 validate={[ required, email ]}
                 light
                 keyboardType="email-address"
                 inputProps={{
                   returnKeyType: 'next',
                   ref: c => (this.email = c),
                   onSubmitEditing: () => this.emailConfirmation._root.focus(),
                 }}
          />
          {this.state.emailChanged ?
            <Field name="emailConfirmation"
                   editable={this.state.active}
                   component={FormField}
                   errorActive
                   inputLabel={I18n.t('ConfirmEmail')}
                   validate={[ required, email, equalToEmail ]}
                   light
                   keyboardType="email-address"
                   inputProps={{
                     ref: c => (this.emailConfirmation = c)
                   }}
            /> : null}

          {this.state.active && platformStyle.platform === 'ios' ?
            <Button block rounded style={{...styles.loginBtn, backgroundColor: platformStyle.brandPrimary}} onPress={this.props.handleSubmit(this.submit.bind(this))}
            style={sharedStyles.margin('top')}>
              <Text sizeNormal>{I18n.t('SAVE')}</Text>
            </Button> : null
          }
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
            </FooterTab>
          </Footer> : null}
      </Container>
    );
  }
}

const MyDataContactInformationForm = reduxForm({
  enableReinitialize: true,
  form: "MyDataContactInformationForm"
})(MyDataContactInformation);

function bindAction( dispatch ) {
  return {
    loadDataFormContactInfo: ( formData ) => dispatch(loadDataFormContactInfo(formData)),
  };
}

const selector = formValueSelector('MyDataContactInformationForm');
const mapStateToProps = state => {
  return ({
    dataForm: selector(state, 'phone1', 'email', 'phone2'),
    initialValues: state.generalReducer.formDataContactInfo
  })
};

export default connect(mapStateToProps, bindAction)(MyDataContactInformationForm);

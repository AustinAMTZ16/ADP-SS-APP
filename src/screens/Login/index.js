import React, { Component } from "react";
import { Image, TouchableOpacity, Keyboard } from "react-native";
import { Header, View, Content, Button, Text, Row, Icon } from "native-base";
import { connect } from 'react-redux';
import I18n from 'react-native-i18n';
import Spinner from 'react-native-loading-spinner-overlay';
import waterfall from 'async/waterfall';
import * as OpenAnything from 'react-native-openanything';
import Config from 'react-native-config';
import { Field, reduxForm, formValueSelector } from "redux-form";
import PopupDialog from '../../components/PopupDialog/';
import IconFontello from '../../components/IconFontello/';
import yellowImg from "../../../assets/images/yellow_login.png";
import logo from "../../../assets/images/kplc.png";
import firebaseService from "../../services/firebase/firebaseService";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import Checkbox from '../../components/Checkbox/'
import { loggedInRedux, loggedOutRedux, loadDataLoginForm } from '../../actions/security';
import ImgBackgroundContainer from '../../components/ImageBackground/';
import { required, email, numeric } from '../../shared/validations';
import FormField from '../../components/FormField/'
import splash from "../../../assets/images/splash_blurred.png";
import styles from './styles';
import { platformStyle } from "../../theme";
import sharedStyles from '../../shared/styles';
import securityService from "../../services/security/securityService";
import repo from '../../services/database/repository';
import BackButton from '../../components/BackButton';
import TouchID from 'react-native-touch-id';
import DeviceInfo from 'react-native-device-info';
import TimerMixin from "react-timer-mixin";


const validLogin = (value) => (email(value) && numeric(value)) ? 'Invalid username' : null;

class Login extends Component {
  constructor() {
    super();
    this.state = {
      filter: 'account',
      spinnerVisible: false,
      passwordType: 'password',
      activateFingerprintVisible: false,
      loginWithFingerprintVisible: false,
      visibleOptions: true,
    }
  }

  componentDidMount() {
    TimerMixin.setTimeout(() => {
      this.showPopupAlert(I18n.t("INFO"), I18n.t("LoginAdvice"));
    }, 1000);
    let user_remember = repo.configuration.getField('user_remember');
    let user_username = repo.configuration.getField('user_username');
    let activateFingerprint = repo.configuration.getField('activateFingerprint');
    let loginWithFingerprint = repo.configuration.getField('loginWithFingerprint');

    let activateFingerprintVisible = activateFingerprint === "yes";
    this.setState(
      {
        activateFingerprintVisible: activateFingerprintVisible,
        loginWithFingerprintVisible: loginWithFingerprint,
        visibleOptions: loginWithFingerprint == "" ? true : !loginWithFingerprint
      }
    );

    if (user_remember)
      this.props.loadDataLoginForm({ email: user_username, saveEmail: user_remember, useFingerprint: activateFingerprintVisible });
    else
      this.props.loadDataLoginForm({ email: '', saveEmail: '' });
  }

  submitFingerprint() {

    const optionalConfigObject2 = {
      title: I18n.t('fingerprintTitle'),// Android
      imageColor: '#e00606', // Android
      imageErrorColor: '#ff0000', // Android
      sensorDescription: I18n.t('fingerprintSensorTitle'), // Android
      sensorErrorDescription: I18n.t('fingerprintSensorError'),// Android
      cancelText: I18n.t('fingerprintCancel'), // Android
      fallbackLabel: 'Show Passcode', // iOS (if empty, then label is hidden)
      unifiedErrors: false, // use unified error messages (default false)
      passcodeFallback: false // iOS - allows the device to fall back to using the passcode, if faceid/touch is not available. this does not mean that if touchid/faceid fails the first few times it will revert to passcode, rather that if the former are not enrolled, then it will use the passcode.
    };

    TouchID.authenticate(I18n.t('fingerprintTitle2'), optionalConfigObject2)
      .then(success => {
        this.props.loadDataLoginForm({ email: repo.configuration.getField("user_username"), saveEmail: true });

        var values = {};
        values.saveEmail = true; //When fingerprint we save user
        values.saveUser = false; //When fingerprint we do not save pass
        values.useFingerprint = true;
        values.nickName = repo.configuration.getField("user_username");
        values.password = repo.configuration.getField('user_plain_password');
        this.submit(values);
      })
      .catch(error => {
        console.error('Authentication Failed');
      });
  }

  submit(values) {
    Keyboard.dismiss();

    this.setState({ spinnerVisible: true });
    waterfall([
      (callback) => {

        repo.configuration.setField('idCustomer', null);
        repo.configuration.setField('notificationsActivated', false);
        repo.configuration.setField('idPaymentForm', null);
        repo.configuration.setField('consumptionMeter', null);
        repo.configuration.setField('consumptionUsage', null);
        repo.configuration.setField('customerData', JSON.stringify({}));
        repo.configuration.setField('accountServices', JSON.stringify({}));
        repo.configuration.setField('accountDetail', JSON.stringify({}));
        repo.configuration.setField('accountAdditionalData', JSON.stringify({}));
        repo.configuration.setField('bills', JSON.stringify({}));
        repo.configuration.setField('recharges', JSON.stringify({}));
        repo.configuration.setField('accountAgreement', JSON.stringify({}));
        repo.configuration.setField('consumptionMeters', JSON.stringify({}));
        repo.configuration.setField('consumptionUsages', JSON.stringify({}));
        repo.configuration.setField('consumptionLoadData', JSON.stringify({}));
        repo.configuration.setField('accountListAction', JSON.stringify({}));

        securityService.autenticateAction('password', values.nickName, values.password, callback);
      }
    ], (err, result) => {
      this.setState({ spinnerVisible: false });
      if (!err) {
        this.setState({ spinnerVisible: false });
        repo.configuration.setField('user_remember', (values.useFingerprint && values.useFingerprint === true) || values.saveEmail === true);
        repo.configuration.setField('password_remember', values.saveUser === true);
        repo.configuration.setField('loginWithFingerprint', values.useFingerprint === true);
        firebaseService.registerDevice();

        this.props.loggedInRedux();
      } else {
        this.setState({ spinnerVisible: false },
          function () {
            // if( err === "INVALID_PASSWORD" ) {
            //   TimerMixin.setTimeout(() => {
            //     this.showPopupAlert("Error", I18n.t("alert_login_message_1"));
            //   }, 1000);
            // } 
            if (err === 'HTTP 500 Internal Server Error') {
              TimerMixin.setTimeout(() => {
                this.showPopupAlert("Error", I18n.t("ALERT_NOT_LOGIN"));
              }, 1000)
            }
            else {
              TimerMixin.setTimeout(() => {
                this.showPopupAlert("Error", I18n.t("ALERT_NOT_INTERNET"));
              }, 1000);
            }
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
  showPopupAlert(title, text, content, options) {
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

  componentWillUnmount() {
    this.setState({ spinnerVisible: false });
  }

  render() {
    const navigation = this.props.navigation;
    let versionDevice = DeviceInfo.getVersion().toString();

    return (
      <ImgBackgroundContainer source={splash}>
        <Header transparent />
        <PopupDialog
          refModal={this.state.messageAlert}
        />
        <View style={{ ...sharedStyles.alignItems('end'), flexDirection: 'row', justifyContent: 'space-between' }}>
          <Image source={logo} style={{ height: 60, marginLeft: 10 }} />
          <Image source={yellowImg} />
        </View>
        <Content padder style={styles.content}>
          <BackButton />
          <View style={{ flexDirection: 'row', }}>
            <View style={{ width: platformStyle.deviceWidth - 30 }}>
              <Field name="nickName"
                component={FormField}
                errorActive={true}
                //type="email"
                //keyboardType="email-address"
                placeholder={I18n.t('Username')}
                validate={[required]}
                inputProps={{
                  returnKeyType: 'next',
                  onSubmitEditing: () => this.passwordInput._root.focus(),
                }}
              />
            </View>
          </View>

          <View style={{ marginTop: -15 }}></View>

          <View style={{ flexDirection: 'row', }}>
            <View style={{ width: platformStyle.deviceWidth - 60 }}>
              <Field name="password"
                component={FormField}
                errorActive={true}
                type={this.state.passwordType}
                placeholder={I18n.t('Contrase??a')}
                validate={[required]}
                inputProps={{
                  ref: c => (this.passwordInput = c),
                  onSubmitEditing: this.props.handleSubmit(this.submit.bind(this)),
                }}
              />
            </View>
            <View>
              <TouchableOpacity
                onPress={() => this.setState({ passwordType: this.state.passwordType === 'password' ? undefined : 'password' })}>
                <Icon
                  active
                  name={this.state.passwordType === 'password' ? "ios-eye-outline" : "ios-eye-off-outline"}
                  style={{
                    color: platformStyle.contentTextColor,
                    fontSize: 40
                  }}
                />
              </TouchableOpacity>
            </View>
          </View>
          <View style={{
            flexDirection: 'row', ...sharedStyles.justifyContent('spaceBetween')
          }}>

            {
              this.state.visibleOptions ?
                <Field name="saveEmail"
                  component={Checkbox}
                  label={<Text sizeNormal
                    style={{ ...sharedStyles.margin('left', 2) }}>
                    {I18n.t('SaveUser')}
                  </Text>
                  }
                  validate={[]}
                  {...this.props}
                />
                : null
            }

            {
              this.state.visibleOptions ?
                <Field name="saveUser"
                  component={Checkbox}
                  label={<Text sizeNormal
                    style={{ ...sharedStyles.margin('left', 2) }}>{I18n.t('SavePassword')}</Text>}
                  validate={[]}
                  {...this.props}
                />
                : null
            }


          </View>

          {this.state.activateFingerprintVisible ?
            <Field name="useFingerprint"
              component={Checkbox}
              label={<Text sizeNormal style={{ ...sharedStyles.margin('left', 2) }}>{I18n.t('fingerprintActivate')}</Text>}
              onPress={(value) => this.setState({ visibleOptions: !value })}
              validate={[]}
              {...this.props}
            />
            : null}

          <Text> </Text>

          <Row style={sharedStyles.justifyContent('spaceBetween')}>
            <TouchableOpacity onPress={() => this.props.navigation.navigate('Register')}>
              <Text oblique style={styles.links}>{I18n.t('register_link')} {/*//ToDo*/}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => !validLogin(this.props.dataForm.email) ?
              this.props.navigation.navigate('ForgotPassword', { email: this.props.dataForm.email }) :
              this.props.navigation.navigate('ForgotPassword')
            }>
              <Text oblique style={styles.links}>{I18n.t('forgot_password')}</Text>
            </TouchableOpacity>
          </Row>

          <Button block rounded wide style={{ ...styles.loginBtn, backgroundColor: platformStyle.brandPrimary }}
            onPress={this.props.handleSubmit(this.submit.bind(this))}>
            <Text>{I18n.t('login')}</Text>
          </Button>

          {this.state.loginWithFingerprintVisible ?
            <Button block rounded wide style={{ ...styles.loginBtn, backgroundColor: platformStyle.brandPrimary }}
              onPress={this.submitFingerprint.bind(this)}>
              <Text>{I18n.t('fingerprintLogin')}</Text>
              <Icon name={'md-finger-print'} style={{ fontSize: 40, color: 'white' }} />
            </Button>
            : null}


          <View style={{ flexDirection: 'row', marginRight: 20, marginLeft: 20, marginTop: 20, ...sharedStyles.justifyContent('spaceBetween') }}>
            <Button roundedCircleMedium style={{ margin: 10, backgroundColor: platformStyle.brandPrimary }} onPress={() => {
              OpenAnything.Open(Config.OUTGAGE_PORTAL);
            }}>
              <IconFontello name={'info'} size={30} style={{ color: platformStyle.brandWhite }} />
            </Button>

            <Button roundedCircleMedium style={{ margin: 10, backgroundColor: platformStyle.brandPrimary }} onPress={() => {
              navigation.navigate('Help');
            }}>
              <Icon name={'ios-help'} style={{ color: platformStyle.brandWhite, fontSize: 50 }} />
            </Button>

            <Button roundedCircleMedium
              style={{ margin: 10, backgroundColor: platformStyle.brandPrimary, justifyContent: 'center', alignItems: 'center', alignContent: 'center', }}
              onPress={() => {
                navigation.navigate('About');
              }}>
              <MaterialCommunityIcons name={'format-color-text'} style={{ color: platformStyle.brandWhite, paddingTop: 5 }} size={45} />
            </Button>
          </View>


          <View style={{ ...styles.contentButtonFooter, marginTop: 80 }}>
            <View style={{ alignItems: 'center', marginRight: 8, marginLeft: 8 }}>
              <TouchableOpacity style={{}} onPress={() => {
                navigation.navigate('Contact');
              }}>
                <Text small heavy>{I18n.t('CONTACT').toUpperCase()}</Text>
              </TouchableOpacity>
            </View>

            <View style={{ borderRightColor: 'black', borderRightWidth: 1, height: 20 }} />
            <View style={{ alignItems: 'center', marginRight: 8, marginLeft: 8 }}>
              <TouchableOpacity style={{}} onPress={() => {
                navigation.navigate('Tips');
              }}>
                <Text small heavy>{I18n.t('TIPS').toUpperCase()}</Text>
              </TouchableOpacity>
            </View>

            <View style={{ borderRightColor: 'black', borderRightWidth: 1, height: 20 }} />
            <View style={{ alignItems: 'center', marginRight: 10, marginLeft: 8 }}>
              <TouchableOpacity style={{}} onPress={() => {
                navigation.navigate('ValidateDocuments');
              }}>
                <Text small heavy>{I18n.t('VALIDATE_DOC').toUpperCase()}</Text>
              </TouchableOpacity>
            </View>


          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
            {platformStyle.platform === 'android' ?
              <Text>v{versionDevice + I18n.t("COMPATIBLE_WITH")}</Text> :
              <Text>v{versionDevice}</Text>
            }
          </View>


        </Content>

        <Spinner visible={this.state.spinnerVisible} textContent="..." />

      </ImgBackgroundContainer>
    );
  }
}

const LoginView = reduxForm({
  form: "loginForm"
})(Login);

function bindAction(dispatch) {
  return {
    loggedInRedux: () => dispatch(loggedInRedux()),
    loggedOutRedux: () => dispatch(loggedOutRedux()),
    loadDataLoginForm: (formData) => dispatch(loadDataLoginForm(formData))
  };
}

const selector = formValueSelector('loginForm');
const mapStateToProps = state => {
  return {
    dataForm: selector(state, 'email', 'password', 'saveUser', 'saveEmail', 'useFingerprint'),
    initialValues: state.securityReducer.formDataLogin
  }
};


export default connect(mapStateToProps, bindAction)(LoginView);


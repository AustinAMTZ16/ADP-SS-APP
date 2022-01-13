import React, { Component } from "react";
import { TouchableOpacity, Keyboard } from "react-native";
import { Container, View, Content, Button, Text, Row, Col, Icon } from "native-base";
import { Field, reduxForm, formValueSelector } from "redux-form";
import { connect } from 'react-redux';
import _ from "lodash";
import Config from 'react-native-config';

import waterfall from 'async/waterfall';
import { logInRedux } from '../../actions/security';
import { required, email, equalTo, phone, validateDocNumber } from '../../shared/validations';
import FormField from '../../components/FormField/'
import FormPicker from '../../components/FormPicker/'
import Checkbox from '../../components/Checkbox/'
import Header from '../../components/Header/'
import SubHeader from '../../components/SubHeader';
import styles from './styles';
import {platformStyle} from "../../theme";
import sharedStyles from '../../shared/styles';
import I18n from 'react-native-i18n';

import Spinner from '../../components/Spinner';
import repo from '../../services/database/repository'
import generalService from '../../services/general/generalService';
import PopupDialog from '../../components/PopupDialog/';
import * as OpenAnything from 'react-native-openanything';
import firebaseService from "../../services/firebase/firebaseService";
import TimerMixin from "react-timer-mixin";
import { NavigationActions } from 'react-navigation';

const equalToEmail = equalTo('email', 'email');

const backAction = NavigationActions.back({
  key: null
});

class Register extends Component {
  constructor() {
    super();

    this.state = {
      spinnerVisible: false,
    };

    this.showPopupAlert = this.showPopupAlert.bind(this);
  }

  componentDidMount() {
    firebaseService.supervisorAnalytic('REGISTER');
  }

  submit( values ) {
    Keyboard.dismiss();

    this.setState({ spinnerVisible: true });

    waterfall([
      ( callback ) => {
        generalService.postUserAction(values, callback);
      },
    ], ( err, result ) => {

      if( !err ) {
        this.setState({ spinnerVisible: false }, function() {
          
          TimerMixin.setTimeout(() => {
            this.showPopupAlert(I18n.t("INFO"), I18n.t("REGISTERED_OK"),{
              1: {
                key: 'button1',
                text: `${I18n.t('accept')}`,
                action: () => this.props.navigation.dispatch(backAction),
                align: ''
              }
            });          
          }, 1000);
        }.bind(this));

      } else {
        this.setState({ spinnerVisible: false }, function() {
          TimerMixin.setTimeout(() => {
            this.showPopupAlert(I18n.t("INFO"), err);
          }, 1000);
        }.bind(this));

      }
    })
  }

  componentWillUnmount() {
    this.setState({ spinnerVisible: false });
  }

  /**
   * POPUP
   * @param title
   * @param text
   * @param options
   */
  showPopupAlert( title, text, options, content ) {
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
        }
      }
    })
  }

  render() {
    return (
      <Container>
        <Header {...this.props} noDrawer/>
        <SubHeader text={I18n.t('REGISTER')} back {...this.props}/>
        <PopupDialog
          refModal={this.state.messageAlert}
        />
        <Content padderHorizontal>
          <Field name="accountReference"
                 component={FormField}
                 errorActive={true}
                 inputLabel={I18n.t('ACCOUNT_NO')}
                 placeholder="..."
                 validate={[ required ]}
                 icon={{
                   color: platformStyle.brandPrimary,
                   name: "md-information-circle",
                   toRigth: true,
                   fontSize: 30,
                 }}
                 underline
                 light
                 inputProps={{
                   returnKeyType: 'next',
                   ref: c => (this.accountReference = c)
                 }}
          />

          <Field name="nickName"
                 component={FormField}
                 errorActive={true}
                 inputLabel={I18n.t('Username')}
                 placeholder="..."
                 validate={[ required ]}
                 underline
                 light
                 inputProps={{
                   returnKeyType: 'next',
                   ref: c => (this.nickName = c)
                 }}
          />

          {/*
          <Field name="docType"
                 component={FormPicker}
                 validationActive
                 inputLabel={I18n.t('IdentificationDocument')}
                 borderBottomStyle
                 errorActive
                 reinit
                 validate={[ required ]}
                 onChange={( value ) => {
                   //this.props.change('idStreet', '');
                   this.loadDocCountry(value);
                 }}
                 dataItems={this.state.documType}
                 inputProps={{
                   returnKeyType: 'next',
                   ref: c => (this.docType = c)
                 }}
          />

          <Field name="expeditionCountry"
                 component={FormPicker}
                 validationActive
                 inputLabel={I18n.t('DocumentCountry')}
                 borderBottomStyle
                 errorActive
                 reinit
                 validate={[ required ]}
                 dataItems={this.state.filteredCountryDocs}
                 inputProps={{
                   returnKeyType: 'next',
                   ref: c => (this.expeditionCountry = c),
                   onSubmitEditing: () => this.docNumber._root.focus()
                 }}
          />

          <Field name="docNumber"
                 component={FormField}
                 errorActive={true}
                 inputLabel={I18n.t('DocumentNumber')}
                 validate={[ required, validateDocNumber ]}
                 icon={{
                   color: platformStyle.brandPrimary,
                   name: "md-information-circle",
                   toRigth: true,
                   fontSize: 30,
                 }}
                 underline
                 light
                 inputProps={{
                   returnKeyType: 'next',
                   ref: c => (this.docNumber = c),
                   onSubmitEditing: () => this.email._root.focus()
                 }}
          />
          */}

          <Field name="email"
                 component={FormField}
                 type="email"
                 keyboardType="email-address"
                 errorActive={true}
                 inputLabel={I18n.t('Email')}
                 validate={[ required, email ]}
                 inputProps={{
                   returnKeyType: 'next',
                   ref: c => (this.email = c),
                   onSubmitEditing: () => this.emailConfirmation._root.focus(),
                 }}
          />
          <Field name="emailConfirmation"
                 component={FormField}
                 type="email"
                 keyboardType="email-address"
                 errorActive={true}
                 inputLabel={I18n.t('Confirm_your_email')}
                 validate={[ required, email, equalToEmail ]}
                 inputProps={{
                   returnKeyType: 'next',
                   ref: c => (this.emailConfirmation = c)
                 }}
          />
          {/*

           --Commented meanwhile this JIRA is solved: PIEI-41333--

          <Field name="phone"
                 component={FormField}
                 errorActive={true}
                 inputLabel={`${I18n.t('Telephone')} (e.g.: 254711999999)`}
                 keyboardType="numeric"
                 validate={[ required, phone ]}
                 inputProps={{
                   ref: c => (this.phone = c),
                   onSubmitEditing: () => Keyboard.dismiss(),
                 }}
          />

          <View style={sharedStyles.padding('vertical', 2)}>
            <Text large>{I18n.t('preferred_login')}</Text>
            <Col style={sharedStyles.margin('top', 2)}>
              <Row>
                <TouchableOpacity onPress={() => this.setState({ filter: 'account' })}>
                  <Row style={sharedStyles.alignItems()}>
                    <Icon name={this.state.filter === 'account' ? 'md-radio-button-on' : 'md-radio-button-off'}
                          style={{ color: platformStyle.brandSecondary }}/>
                    <Text sizeNormal style={sharedStyles.margin('left', 2)}>{I18n.t('Email')}</Text>
                  </Row>
                </TouchableOpacity>
              </Row>
              <Row>
                <TouchableOpacity onPress={() => this.setState({ filter: 'meter' })}>
                  <Row style={{ ...sharedStyles.alignItems(), marginTop: 5 }}>
                    <Icon name={this.state.filter === 'meter' ? 'md-radio-button-on' : 'md-radio-button-off'}
                          style={{ color: platformStyle.brandSecondary }}/>
                    <Text sizeNormal style={sharedStyles.margin('left', 2)}>{I18n.t('PhoneNumber')}</Text>
                  </Row>
                </TouchableOpacity>
              </Row>
            </Col>
          </View>
           */}

          <View style={sharedStyles.padding('vertical', 2)}>
            <Field name="termsConditions"
                   component={Checkbox}
                   label={<Text sizeNormal
                                style={{ ...sharedStyles.margin('left', 2), width: platformStyle.deviceWidth - 60 }}>
                     {I18n.t('MSG003')}{' '}
                     <Text style={{ textDecorationLine: 'underline' }}
                            onPress={() => OpenAnything.Open(Config.TERMS_CONDITIONS)}>
                       {I18n.t('Terms_and_Conditions')}
                     </Text>
                   </Text>
                   }
                   validate={[ required ]}
                   {...this.props}
            />
          </View>

          <Button primary rounded wide style={styles.loginBtn}
                  onPress={this.props.handleSubmit(this.submit.bind(this))}>
            <Text>{I18n.t('REGISTER')}</Text>
          </Button>
        </Content>

        <Spinner visible={this.state.spinnerVisible} textContent="..."/>
      </Container>
    );
  }
}

const RegisterView = reduxForm({
  form: "registerForm"
})(Register);

function bindAction( dispatch ) {
  return {
    logInRedux: () => dispatch(logInRedux()),
  };
}

const selector = formValueSelector( 'registerForm' );
const mapStateToProps = state => {
  return {
    email: selector( state, 'email' ),
    emailConfirmation: selector( state, 'emailConfirmation' ),
  }
};

export default connect(mapStateToProps, bindAction)(RegisterView);

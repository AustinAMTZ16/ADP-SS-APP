import React, { Component } from "react";
import { Keyboard } from 'react-native';
import { Text, Button, Content, Container, Footer, FooterTab, View } from "native-base";
import I18n from 'react-native-i18n';
import { Field, reduxForm, formValueSelector } from "redux-form";
import { connect } from 'react-redux';

import Header from '../../../components/Header';
import SubHeader from '../../../components/SubHeader';
import FormField from '../../../components/FormField/';
import FormPicker from '../../../components/FormPicker/';
import { required, equalTo, email, numeric } from '../../../shared/validations';
import {platformStyle} from "../../../theme";
import sharedStyles from '../../../shared/styles';

import Spinner from '../../../components/Spinner';
import waterfall from 'async/waterfall';
import PopupDialog from '../../../components/PopupDialog/';
import generalService from '../../../services/general/generalService';
import Checkbox from '../../../components/Checkbox/';
import TimerMixin from "react-timer-mixin";


const equalToEmail = equalTo('email', 'email');

class NewComplaint extends Component {
  constructor( props ) {
    super(props);

    this.state = {
      spinnerVisible: false,
    };

    this.showPopupAlert = this.showPopupAlert.bind(this);
  }

  submit( values ) {
    Keyboard.dismiss();

    this.setState({ spinnerVisible: true });

    waterfall([
      ( callback ) => {
        generalService.postSuggestionAction(values, callback);
      },
    ], ( err, result ) => {

      if( !err ) {
        this.setState({ spinnerVisible: false }, function() {

          TimerMixin.setTimeout(() => {
            this.showPopupAlert(I18n.t("INFO"), I18n.t("OPERATION_SUCCESS2"));
          }, 1000);
        }.bind(this));

      } else {
        this.setState({ spinnerVisible: false }, function() {

          TimerMixin.setTimeout(() => {
            this.showPopupAlert(I18n.t("INFO"), I18n.t("HAS_ERROR_RETRY"));
          }, 1000);
        }.bind(this));

      }
    })
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
        height: 200,
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

  render() {
    return (
      <Container>
        <Header {...this.props} noDrawer iconAction/>
        <SubHeader text={I18n.t('Complaint & Suggestions')} back {...this.props}/>
        <PopupDialog
          refModal={this.state.messageAlert}
        />
        <Content padderHorizontal>
          <View style={sharedStyles.padding('bottom')}>
            <Field name="name"
                   component={FormField}
                   errorActive
                   inputLabel={I18n.t('Name')}
                   validate={[ required ]}
                   light
                   inputProps={{
                     returnKeyType: 'next',
                     onSubmitEditing: () => this.phone._root.focus(),
                   }}
            />
            <Field name="phone"
                   component={FormField}
                   errorActive
                   inputLabel={I18n.t('Phone')}
                   validate={[ required, numeric ]}
                   keyboardType="numeric"
                   light
                   inputProps={{
                     ref: c => (this.phone = c),
                     returnKeyType: 'next',
                     onSubmitEditing: () => this.email._root.focus(),
                   }}
            />
            <Field name="email"
                   component={FormField}
                   errorActive
                   inputLabel={I18n.t('Email')}
                   validate={[ required, email ]}
                   light
                   keyboardType="email-address"
                   inputProps={{
                     ref: c => (this.email = c),
                     returnKeyType: 'next',
                     onSubmitEditing: () => this.emailConfirmation._root.focus(),
                   }}
            />
            <Field name="emailConfirmation"
                   component={FormField}
                   errorActive
                   inputLabel={I18n.t('Confirm Email')}
                   validate={[ required, email, equalToEmail ]}
                   keyboardType="email-address"
                   light
                   inputProps={{
                     ref: c => (this.emailConfirmation = c),
                     returnKeyType: 'next',
                   }}
            />
            <Field name="type"
                   component={FormPicker}
                   inputLabel={I18n.t('Complaint or Suggestion')}
                   errorActive
                   validate={[ required ]}
                   dataItems={[
                     { code: 1, val: 'Complaint' },
                     { code: 2, val: 'Suggestion' }
                   ]}
                   underline
                   light
            />
            <Field name="description"
                   component={FormField}
                   errorActive
                   inputLabel={I18n.t('Description')}
                   validate={[ required ]}
                   underline
                   light
                   multiline
                   height={70}
                   inputProps={{
                     numberOfLines: 3
                   }}
            />
            <View style={{ ...sharedStyles.margin('bottom'), ...sharedStyles.margin('top', 2) }}>
              <Field name="termsConditions"
                     component={Checkbox}
                     label={<Text sizeNormal style={{...sharedStyles.margin('left', 2), width: platformStyle.deviceWidth - 60}}>
                              {I18n.t( 'MSG003' )}{' '}
                              <Text style={{textDecorationLine: 'underline'}} onPress={() => this.props.navigation.navigate('TermsConditions')}>
                                {I18n.t( 'Terms_and_Conditions' )}
                              </Text>
                            </Text>
                          }
                     validate={[ required ]}
                     {...this.props}
              />
            </View>

          </View>
        </Content>

        <Footer noBorders padder>
          <FooterTab>
            <Button block primary rounded onPress={this.props.handleSubmit(this.submit.bind(this))}>
              <Text sizeNormal>{I18n.t('Submit')}</Text>
            </Button>
          </FooterTab>
        </Footer>
        <Spinner visible={this.state.spinnerVisible} textContent="..."/>
      </Container>
    );
  }
}

const NewComplaintForm = reduxForm({
  form: "ComplaintForm",
})(NewComplaint);

const selector = formValueSelector( 'ComplaintForm' );
const mapStateToProps = state => {
  return ({
    initialValues: {
      email: selector( state, 'email' ),
      emailConfirmation: selector( state, 'emailConfirmation' ),
    },
  })
};

export default connect(mapStateToProps)(NewComplaintForm);

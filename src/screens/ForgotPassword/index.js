import React, {Component} from "react";
import { Keyboard } from "react-native";
import {Container, Content, Button, Text} from "native-base";
import {Field, reduxForm} from "redux-form";

import {required, equalTo} from '../../shared/validations';
import FormField from '../../components/FormField/'
import Header from '../../components/Header/'
import SubHeader from '../../components/SubHeader';
import sharedStyles from '../../shared/styles';
import I18n from 'react-native-i18n';
import Spinner from 'react-native-loading-spinner-overlay';
import waterfall from "async/waterfall";
import generalService from "../../services/general/generalService";
import PopupDialog from '../../components/PopupDialog/';
import firebaseService from "../../services/firebase/firebaseService";
import TimerMixin from "react-timer-mixin";
import {platformStyle} from "../../theme";

const emailOrPhone = ( val ) => val && /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test( val ) ? null :
  /^254[0-9]{9}$/.test( val ) ? null : 'This is not a valid email or phone number';

const equalToPassword = equalTo( 'password', 'password' );

class ForgotPassword extends Component {
  constructor() {
    super();

    this.state = {
      spinnerVisible: false,
    }
  }

  componentDidMount() {
    if( _.get( this.props, 'navigation.state.params.email' ) )
      this.props.change( 'UserEmailOrCel', this.props.navigation.state.params.email )
    firebaseService.supervisorAnalytic('FORGOTPASSWORD');
  }

  submitnew( values ) {

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

  submit( values ) {
    Keyboard.dismiss();

    waterfall([
      ( callback ) => {
        this.setState({ spinnerVisible: true });
        let user = values.UserEmailOrCel;
        user = user.replace("@","%40");

        generalService.forgotPasswordAction(user, callback)
      },

    ], ( err, result ) => {
      this.setState({ spinnerVisible: false },
        function() {
          if( !err ) {
            TimerMixin.setTimeout(() => {
              this.showPopupAlert(I18n.t("INFO"), I18n.t("EMAIL_RECEPTION"));
            }, 1000);

          } else {
            TimerMixin.setTimeout(() => {
              this.showPopupAlert("Error", err);
            }, 1000);

          }
        });

    })
  }


  /**
   *
   * @param title
   * @param text
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

  render() {
    return (
      <Container>
        <Header {...this.props} noDrawer/>
        <PopupDialog
          refModal={this.state.messageAlert}
        />
        <SubHeader text={I18n.t('forgot_password')} back {...this.props}/>
        <Content padderHorizontal>
          <Text large dark medium>{I18n.t('ENTER_PHONE_MAIL')}</Text>
          <Text large dark medium>{I18n.t('EMAIL_RECEPTION')}</Text>
          <Text> </Text>

          <Field name="UserEmailOrCel"
                 component={FormField}
                 type="email"
                 errorActive={true}
                 inputLabel={I18n.t('Username')}                
                 validate={[ required]}
                 inputProps={{
                   onSubmitEditing: this.props.handleSubmit(this.submit.bind(this)),
                 }}
          />

          <Button full rounded style={{...sharedStyles.margin('top'), backgroundColor: platformStyle.brandPrimary}}
                  onPress={this.props.handleSubmit(this.submit.bind(this))}>
            <Text>{I18n.t('Submit')}</Text>
          </Button>


          <Button full rounded 
                  style={{...sharedStyles.margin('top'), backgroundColor: platformStyle.brandPrimary}}
                  onPress={this.props.handleSubmit(this.submitnew.bind(this))}>
            <Text>BTN Pruebas</Text>
          </Button>

        </Content>

        <Spinner visible={this.state.spinnerVisible} textContent="..."/>
      </Container>
    );
  }
}

export default reduxForm( {
  form: "ForgotPasswordForm"
} )( ForgotPassword );

import React, { Component } from "react";
import { Keyboard } from "react-native";
import { Container, Content, Button, Text } from "native-base";
import { Field, reduxForm,formValueSelector } from "redux-form";
import { connect } from 'react-redux';
import { logInRedux } from '../../actions/security';

import { required, equalTo } from '../../shared/validations';
import FormField from '../../components/FormField/'
import Header from '../../components/Header/'
import SubHeader from '../../components/SubHeader';
import sharedStyles from '../../shared/styles';
import I18n from 'react-native-i18n';
import Spinner from 'react-native-loading-spinner-overlay';
import waterfall from "async/waterfall";
import repo from "../../services/database/repository";
import generalService from "../../services/general/generalService";
import PopupDialog from '../../components/PopupDialog/';
import TimerMixin from "react-timer-mixin";
import firebaseService from "../../services/firebase/firebaseService";
const equalToPassword = equalTo('newPwd', 'password');
import { NavigationActions } from 'react-navigation';

const backAction = NavigationActions.back({
  key: null
});

class ChangePassword extends Component {
  constructor() {
    super();

    this.state = {
      spinnerVisible: false
    }
  }

  componentDidMount() {
    firebaseService.supervisorAnalytic('PASSWORD');
  }

  submit( values ) {
    Keyboard.dismiss();
    let user = repo.configuration.getField('user_username');
    this.setState({ spinnerVisible: true });

    waterfall([
      ( callback ) => {
        let objData = {
          nickName: user,
          currentPwd: values.currentPwd,
          newPwd: values.newPwd
        };
        generalService.changePasswordAction(objData, callback)
      }

    ], ( err, result ) => {
      if( !err ) {
        this.setState({ spinnerVisible: false }, function() {

          TimerMixin.setTimeout(() => {
            this.showPopupAlert(I18n.t("INFO"), I18n.t("PASS_CHANGED"),{
              1: {
                key: 'button1',
                text: `${I18n.t('accept')}`,
                action: () => {var me = this;
                  TimerMixin.setTimeout(() => {
                    me.props.navigation.dispatch(backAction);
                  }, 500);
                },
                align: ''
              }
            });
          }, 500);
        }.bind(this));

      } else {
        this.setState({ spinnerVisible: false }, function() {
          TimerMixin.setTimeout(() => {
            this.showPopupAlert(I18n.t("HAS_ERROR"), err);
          }, 1000);
        }.bind(this));

      }
    })
  }

  componentWillUnmount() {
    this.setState({ spinnerVisible: false });
  }

  /**
   *
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
        <Header {...this.props} noDrawer
                iconAction={'ios-home-outline'}
        />
        <SubHeader text={I18n.t('change_password')} back={true} {...this.props}
        />
        <PopupDialog
          refModal={this.state.messageAlert}
        />
        <Content padderHorizontal>
          <Text large dark medium style={{marginVertical: 5}}>{I18n.t("OLD_PASSWORD")}</Text>


          <Field name="currentPwd"
                 component={FormField}
                 errorActive={true}
                 type="password"
                 placeholder={I18n.t('current_password')}
                 validate={[ required ]}
                 inputProps={{
                   returnKeyType: 'next',
                   onSubmitEditing: () => this.newPwd._root.focus(),
                 }}
          />

          <Field name="newPwd"
                 component={FormField}
                 errorActive={true}
                 type="password"
                 placeholder={I18n.t('new_password')}
                 validate={[ required ]}
                 inputProps={{
                   returnKeyType: 'next',
                   onSubmitEditing: () => this.repeat_new_password._root.focus(),
                 }}
          />

          <Field name="repeat_new_password"
                 component={FormField}
                 errorActive={true}
                 type="password"
                 placeholder={I18n.t('repeat_new_password')}
                 validate={[ required, equalToPassword ]}
                 inputProps={{
                   ref: c => (this.repeat_new_password = c),
                   onSubmitEditing: this.props.handleSubmit(this.submit.bind(this)),
                 }}
          />


          <Button full rounded style={sharedStyles.margin('top')}
                  onPress={this.props.handleSubmit(this.submit.bind(this))}>
            <Text>{I18n.t('Submit')}</Text>
          </Button>
        </Content>

        <Spinner visible={this.state.spinnerVisible} textContent="..."/>
      </Container>
    );
  }
}

const ChangePasswordView = reduxForm({
  form: "ChangePasswordForm"
})(ChangePassword);

function bindAction( dispatch ) {
  return {
    logInRedux: () => dispatch(logInRedux()),
  };
}
const mapStateToProps = state => ({});
export default connect (mapStateToProps,bindAction)(ChangePasswordView);
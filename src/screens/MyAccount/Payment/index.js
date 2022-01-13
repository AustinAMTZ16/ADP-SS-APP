import React, {Component} from "react";
import {Keyboard} from 'react-native';
import {Text, Button, Content, Container, Footer, FooterTab} from "native-base";
import I18n from 'react-native-i18n';
import {Field, reduxForm} from "redux-form";
import TimerMixin from "react-timer-mixin";
import _ from "lodash";

import Header from '../../../components/Header';
import FormField from '../../../components/FormField/';
import {required, numeric} from '../../../shared/validations';
import {platformStyle} from "../../../theme";
import repo from '../../../services/database/repository'
import waterfall from "async/waterfall";
import PaymentService from "../../../services/general/paymentService";
import SubHeader from '../../../components/SubHeader';
import Spinner from '../../../components/Spinner';
import firebaseService from "../../../services/firebase/firebaseService";
import PopupDialog from '../../../components/PopupDialog/';

const errorMeg = 'An error has occurred, please try again later';

class Payment extends Component {
  constructor( props ) {
    super( props );

    this.accountData = JSON.parse( repo.configuration.getField( 'accountDetail' ) );
    this.additionalData = JSON.parse( repo.configuration.getField( 'accountAdditionalData' ) );
    this.state = {};
  }

  componentDidMount() {
    if( this.accountData && this.accountData.contractData && this.additionalData && !this.additionalData.indPrepayment )
      this.props.change( 'amount', this.accountData.contractData.balance < 0 ? Math.ceil( (this.accountData.contractData.balance * -1) ).toString() : '0' );

    let phone = JSON.parse( repo.configuration.getField( 'customerData' ) ).phone1;
    if( phone ) {
      phone = phone.replace( "+", "" );
      phone = phone.replace( " ", "" );
      this.props.change( 'phone', phone );
    }
    firebaseService.supervisorAnalytic( 'AccountPayment' );
  }

  showPopupAlert( title, text, goBack ) {
    this.setState( {
      messageAlert: {
        refresh: new Date().valueOf(),
        outside: false,
        title: title,
        height: 300,
        animation: 2,
        contentText: text,
        options: {
          1: {
            key: 'button1',
            text: `${I18n.t( 'Close' )}`,
            action: () => goBack ? this.props.navigation.goBack() : {}
          }
        },
      }

    } )
  }

  submit = ( values ) => {
    Keyboard.dismiss();
    this.setState( { spinnerVisible: true } );

    waterfall( [
      this.getToken,
      this.sendPayment.bind( this, values ),
    ], ( error, result ) => {
      this.setState( { spinnerVisible: false } );

      if( error ) {
        return TimerMixin.setTimeout( () => {
          this.showPopupAlert( "Error", error );
        }, 1000 )
      }

      TimerMixin.setTimeout( () => {
        this.showPopupAlert( I18n.t("INFO"), 'Please wait to enter M-PESA PIN', true );
      }, 1000 )
    } )
  };

  getToken = ( cb ) => {
    if( !this.additionalData ) return cb( errorMeg );

    PaymentService.getPaymentToken( this.additionalData.indPrepayment ).then( response => {
      if( !response.ok ) {
        if( _.get( response, 'data.errorMessage' ) ) return cb( response.data.errorMessage );
        if( response.error ) return cb( response.error );
        return cb( errorMeg );
      }

      return cb( null, response.data )
    } )
  };

  sendPayment = ( formValues, authData, cb ) => {
    const meters = this.additionalData.indPrepayment ? JSON.parse( repo.configuration.getField( 'consumptionMeters' ) ) : null;

    if( !this.additionalData ) return cb( errorMeg );
    if( this.additionalData.indPrepayment ) {
      if( !meters || !meters[0] ) return cb( errorMeg );
    } else if( !this.accountData ) return cb( errorMeg );

    const data = {
      referenceNumber: this.additionalData.indPrepayment ? meters[0].serialNum :
        _.get( this.accountData, 'contractData.contractNumber' ),
      accessToken: authData.access_token,
      isPrepaid: this.additionalData.indPrepayment,
      ...formValues
    };

    PaymentService.sendPayment( data ).then( response => {
      if( !response.ok ) {
        if( _.get( response, 'data.errorMessage' ) ) return cb( response.data.errorMessage );
        if( response.error ) return cb( response.error );
        return cb( errorMeg );
      }

      return cb( null, response.data )
    } )
  };

  render() {
    return (
      <Container>
        <Header noDrawer {...this.props}
                iconAction={true}/>

        <SubHeader text={I18n.t( 'Payment' )} back={true} leftIcon="md-close" {...this.props}/>

        <PopupDialog
          refModal={this.state.messageAlert}
        />

        <Content style={{ padding: 20 }}>
          <Field name="phone"
                 component={FormField}
                 editable={false}
                 errorActive={true}
                 inputLabel={`${I18n.t( 'Phone' )} (e.g.: 254711999999)`}
                 keyboardType="numeric"
                 validate={[required, numeric]}
                 inputProps={{
                   ref: c => (this.phone = c),
                   onSubmitEditing: () => this.amount._root.focus(),
                 }}
          />
          <Field name="amount"
                 component={FormField}
                 errorActive
                 inputLabel={I18n.t( 'Amount' )}
                 validate={[required]}
                 keyboardType="numeric"
                 underline
                 light
                 inputProps={{
                   ref: c => (this.amount = c),
                 }}
          />

          {platformStyle.platform === 'ios' ?
            <Button block rounded style={{backgroundColor: platformStyle.brandPrimary}} onPress={this.props.handleSubmit( this.submit )}>
              <Text sizeNormal>{I18n.t( 'Pay' )}</Text>
            </Button> : null
          }
        </Content>
        <Spinner visible={this.state.spinnerVisible} textContent={I18n.t( 'Loading' )}
                 overlayColor={`rgba(0, 0, 0, 0.60)`}
                 textStyle={{ color: '#FFF' }}/>

        {platformStyle.platform === 'android' ?
          <Footer noBorders padder>
            <FooterTab>
              <Button block rounded style={{backgroundColor: platformStyle.brandPrimary}} onPress={this.props.handleSubmit( this.submit )}>
                <Text sizeNormal>{I18n.t( 'Pay' )}</Text>
              </Button>
            </FooterTab>
          </Footer> : null
        }
      </Container>
    );
  }
}

const PaymentPage = reduxForm( {
  form: "AccountPaymentForm"
} )( Payment );

export default PaymentPage;

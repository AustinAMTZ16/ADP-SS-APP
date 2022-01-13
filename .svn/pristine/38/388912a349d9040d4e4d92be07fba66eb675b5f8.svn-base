import React, { Component } from "react";
import { Text, Button, Content, Container, Footer, FooterTab, View } from "native-base";
import I18n from 'react-native-i18n';
import { Field, reduxForm, formValueSelector } from "redux-form";
import { connect } from 'react-redux';

import { loadDataFormEbilling } from '../../../actions/general'
import Header from '../../../components/Header';
import YellowSubHeader from '../../../components/YellowSubHeader';
import SubHeader from '../../../components/SubHeader';
import SubMenu from '../SubMenu';
import FormField from '../../../components/FormField/';
import Checkbox from '../../../components/Checkbox/';
import { required, email, phone } from '../../../shared/validations';
import {platformStyle} from "../../../theme";
import repo from '../../../services/database/repository'
import waterfall from "async/waterfall";
import generalService from "../../../services/general/generalService";

import Spinner from '../../../components/Spinner';
import PopupDialog from '../../../components/PopupDialog/';
import firebaseService from "../../../services/firebase/firebaseService";
import TimerMixin from "react-timer-mixin";
import { NavigationActions } from 'react-navigation'


const backAction = NavigationActions.back({
	  key: null
});

class RequestEBilling extends Component {
  constructor( props ) {
    super(props);
    this.state = {
      smsType: false,
      emailType: false,
      noType: false,
      paramReceived:false
    };
  }

  componentDidMount() {

    firebaseService.supervisorAnalytic('EBILLING');

    this.loadData();
  }

  loadData() {
    const {params} = this.props.navigation.state;
    let idPaymentForm;
    if(params && params.idPaymentForm){
      idPaymentForm = params.idPaymentForm;
    }else{
      idPaymentForm = repo.configuration.getField('idPaymentForm');
    }
    let customerData = JSON.parse(repo.configuration.getField('customerData'));

    waterfall([
      ( callback ) => {
        this.setState({ spinnerVisible: true,idPaymentForm:idPaymentForm,paramReceived:params && params.idPaymentForm });
        generalService.billsPaperLessAction(idPaymentForm, callback);
      },

    ], ( err, result ) => {

	  this.setState({ spinnerVisible: false });

      if( !err ) {
        if( result && result.data ) {
          let data = result.data;
          data[ 'invoiceSms' ] = data.phone ? true : false;
          data[ 'phone' ] = data.phone ? data.phone : customerData.phone1 ? customerData.phone1 : '';
          data[ 'invoiceEmail' ] = data.email ? true : false;
          data[ 'notInvoice' ] = false;
          data[ 'email' ] = result.data.email ? result.data.email : customerData.email;

          this.props.loadDataFormEbilling(data);
        } else {
          let data = {};
          data[ 'phone' ] = data.phone ? data.phone : customerData.phone1 ? customerData.phone1 : '';
          data[ 'invoiceSms' ] = false;
          data[ 'invoiceEmail' ] = false;
          data[ 'notInvoice' ] = true;
          this.props.loadDataFormEbilling(data);
        }
      } else {
        TimerMixin.setTimeout(() => {
          this.showPopupAlert(I18n.t("INFO"), I18n.t("NO_DATA"));
        }, 1000);
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


  submit( values ) {
	if(!values["notInvoice"] && !values["invoiceSms"] && !values["invoiceEmail"]){
		this.showPopupAlert(I18n.t("INFO"), I18n.t("MSG022"));
		return;
	}
	  
    waterfall([
      ( callback ) => {
        this.setState({ spinnerVisible: true });
        let idPaymentForm = this.state.idPaymentForm;
        let dataObj = {};
        if(values.invoiceSms && values.invoiceEmail )
          dataObj = {
            "sendingWayType": "",
            "phone": /^\+\d{1,3}\s\d{9,10}$/.test(values.phone) ? values.phone :
            /^\d{9,10}$/.test(values.phone) ? `+52 ${values.phone}` : '',
            "email": values.email,
            "idAccount":idPaymentForm,
            "useRef": "false"
          };
        else if( values.invoiceEmail )
          dataObj = {
            "sendingWayType": "",
            "phone": "",
            "email": values.email,
            "idAccount":idPaymentForm,
            "useRef": "false"
          };
        else if( values.invoiceSms )
          dataObj = {
            "sendingWayType": "",
            "phone": /^\+\d{1,3}\s\d{9,10}$/.test(values.phone) ? values.phone :
            /^\d{9,10}$/.test(values.phone) ? `+52 ${values.phone}` : '',
            "email": "",
            "idAccount":idPaymentForm,
            "useRef": "false"
          };

        if(values.notInvoice){
          generalService.sendBillsPaperNotInvoice(idPaymentForm, callback);
        }else{
				  generalService.sendBillsPaperLessAction(dataObj, callback);
        }

      }

    ], ( err, result ) => {

      this.setState({ spinnerVisible: false });

      if( !err ) {
        TimerMixin.setTimeout(() => {
          this.showPopupAlert(I18n.t("INFO"), I18n.t("EBILL_OK"), null, {
			  1: {
				  key: 'button1',
				  text: `${I18n.t('accept')}`,
				  action: () => {
					  var me = this;
            if(this.props.navigation.state.params && this.props.navigation.state.params.onGoBack){
              this.props.navigation.state.params.onGoBack();
            }
					  me.props.navigation.dispatch(backAction);
				  },
				  align: ''
			  }
		  });
        }, 1000);
      } else {
        TimerMixin.setTimeout(() => {
          this.showPopupAlert(I18n.t("INFO"), I18n.t("HAS_ERROR_RETRY"));
        }, 1000);

      }
    })
  }

  unCheckRest( checked ) {
    switch( checked ) {
      case 'invoiceSms':
        //this.props.change('invoiceEmail', false);
        this.props.change('notInvoice', false);
        break;
      case 'invoiceEmail':
        //this.props.change('invoiceSms', false);
        this.props.change('notInvoice', false);
        break;
      case 'notInvoice':
        this.props.change('invoiceSms', false);
        this.props.change('invoiceEmail', false);
        break;
    }
  }

  render() {
    return (
      <Container>
        <Header noDrawer {...this.props}
                iconAction={'ios-home-outline'}/>
        {!this.state.paramReceived?
        <SubMenu title={I18n.t('EBILLING_REGISTRATION')} noMenu leftIcon="md-close" {...this.props}/>
            :
            <SubHeader text={I18n.t('EBILLING_REGISTRATION')} back {...this.props}/>
        }
        <YellowSubHeader text={I18n.t('REGISTRATION')}/>
        <PopupDialog
          refModal={this.state.messageAlert}
        />
        <Content padderHorizontal>
          <View>
            <Field name="invoiceSms"
                   component={Checkbox}
                   label={I18n.t('RECEIVE_SMS')}
                   onPress={( value ) => value ? this.unCheckRest('invoiceSms') : {}}
                   {...this.props}
            />
            {this.props.dataForm.invoiceSms ?
              <Field name="phone"
                     component={FormField}
                     errorActive
                     inputLabel={I18n.t('PHONE')}
                     validate={[ required, phone ]}
                     underline
                     light
              /> : null
            }
            <Field name="invoiceEmail"
                   component={Checkbox}
                   label={I18n.t('RECEIVE_EMAIL')}
                   onPress={( value ) => value ? this.unCheckRest('invoiceEmail') : {}}
                   {...this.props}
            />
            {this.props.dataForm.invoiceEmail ?
              <Field name="email"
                     component={FormField}
                     errorActive
                     inputLabel={I18n.t('Email')}
                     validate={[ required, email ]}
                     underline
                     light
              /> : null
            }
            <Field name="notInvoice"
                   component={Checkbox}
                   label={I18n.t("NO_RECEIVE")}
                   onPress={( value ) => value ? this.unCheckRest('notInvoice') : {}}
                   {...this.props}
            />
          </View>

          {platformStyle.platform === 'ios' ?
            <Button block rounded style={{backgroundColor: platformStyle.brandPrimary}} onPress={this.props.handleSubmit(this.submit.bind(this))}>
              <Text sizeNormal>{I18n.t('SAVE')}</Text>
            </Button> : null
          }
        </Content>
        <Spinner visible={this.state.spinnerVisible} textContent={I18n.t('Loading')}
                 overlayColor={`rgba(0, 0, 0, 0.60)`}
                 textStyle={{ color: '#FFF' }}/>

        {platformStyle.platform === 'android' ?
          <Footer noBorders padder>
            <FooterTab>
              <Button block rounded style={{backgroundColor: platformStyle.brandPrimary}} onPress={this.props.handleSubmit(this.submit.bind(this))}>
                <Text sizeNormal>{I18n.t('SAVE')}</Text>
              </Button>
            </FooterTab>
          </Footer> : null
        }
      </Container>
    );
  }
}

const RequestEBillingPage = reduxForm({
  form: "AccountRequestEBillingForm",
  enableReinitialize: true,
})(RequestEBilling);

function bindAction( dispatch ) {
  return {
    loadDataFormEbilling: ( formData ) => dispatch(loadDataFormEbilling(formData)),
  };
}

const selector = formValueSelector('AccountRequestEBillingForm');
const mapStateToProps = state => {
  return {
    dataForm: selector(state, 'invoiceEmail', 'invoiceSms', 'notInvoice', 'email', 'phone'),
    initialValues: state.generalReducer.formDataEBilling
  }
};

export default connect(mapStateToProps, bindAction)(RequestEBillingPage);
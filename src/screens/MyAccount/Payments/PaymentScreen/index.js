import React, { Component } from "react";
import { Text, Button, Content, Container, Row, Body, Left, Right, View, Footer, FooterTab } from "native-base";
import { WebView } from 'react-native';
import { WebView as WebViewIOS } from 'react-native-webview';
import I18n from 'react-native-i18n';
import { Field, reduxForm } from "redux-form";
import { connect } from 'react-redux';

import moment from 'moment-timezone';
import Config from 'react-native-config';

import waterfall from 'async/waterfall';
import {CurrencyText, getCurrencieName} from '../../../../components/CurrencyText/'
import FormPicker from '../../../../components/FormPicker/'
import FormField from '../../../../components/FormField/'
import Header from '../../../../components/Header';
import SubHeader from '../../../../components/SubHeader';
import repo from '../../../../services/database/repository';
import {platformStyle} from "../../../../theme";
import sharedStyles from '../../../../shared/styles';
import Spinner from '../../../../components/Spinner';
import PopupDialog from '../../../../components/PopupDialog/';
import { NavigationActions } from 'react-navigation'
import firebaseService from "../../../../services/firebase/firebaseService";
import { required } from '../../../../shared/validations';
import IconFontello from '../../../../components/IconFontello/';
import generalService from "../../../../services/general/generalService";
import {paymentRefresh} from '../../../../actions/general';
import styles from './styles';
import TimerMixin from "react-timer-mixin";
import {createAlert} from '../../../../components/ScreenUtils';

const backAction = NavigationActions.back({
  key: null
});



class PaymentScreen extends Component {

	constructor( props ) {
		super(props);
		let params = this.props.navigation.state.params;
		
		this.state = {
			spinnerVisible: false,
			initParams: params,
			showOptions:false,
			paypalEnabled:false,
			debitEnabled:false
		};
	}

	componentDidMount() {
		firebaseService.supervisorAnalytic('TOPUP');

		//ADDED THIS LINE ONLY FOR PRODUCT. ONE PAYMENT METHOD
		//this.methodAlreadySelected("DEBIT");
		//return;

		waterfall([
			( callback ) => {
				let req = {};
				generalService.getMethodPayment(req, callback);
			},
		], ( err, result ) => {
			if(!err){
				if(result && result.paymentMethodList && result.paymentMethodList.length>0){
					let paypalEnabled=false;
					let debitEnabled= false;
					result.paymentMethodList.map(function(item){
						if(item.code=="TIMOPA0027"){
							debitEnabled=true;
						}
						if(item.code=="TIMOPA0028"){
							paypalEnabled=true;
						}
					});

					if(result.paymentMethodList.length==1){
						this.methodAlreadySelected(result.paymentMethodList[0].code=='TIMOPA0027'?'DEBIT':'PAYPAL');
					}else{
						this.setState({debitEnabled,paypalEnabled,showOptions:true})
					}
				}else{
					this.setState({
						spinnerVisible: false,
						messageAlert: createAlert(I18n.t("INFO"), I18n.t("PAYMENT_SCREEN_NO_METHOD"),{
							1: {
								key: 'button1',
								text: I18n.t('accept'),
								action: () => {
									this.props.navigation.goBack();
								}
							}
						})
					});
				}
			}else{
				TimerMixin.setTimeout(() => {
					this.setState({...err,spinnerVisible: false});
				}, 1000);
			}
		});
	}

	methodAlreadySelected(method){
		let params = this.state.initParams;
		this.methodSelected = method;

		console.log('PARAMS!!!!!!!!',params)

		let listBills = [];
		if(params.listBills){
			for(let i=0;i<params.listBills.length;i++){
				for(let j=0;j<params.listBills[i].billList.length;j++){
					listBills.push(params.listBills[i].billList[j].idBill);
				}
			}
		}

		let data = {
			indPrepayment: params.indPrepayment,
			idPaymentForm: params.idPaymentForm,
			amount: params.amount,
			listBills: listBills
		};

		/** PROGRAMS */
		let adpProgram = repo.configuration.getField('adpProgramData');
		let program = null;
		if(adpProgram!=null && adpProgram.length){
			program = JSON.parse(adpProgram);
			this.setState({
				program
			});
		}
		generalService.getReference(data, this.onGetReference.bind(this));
	}
	
	onGetReference(err, resp){
		if(!err){
			//let url = "https://tesla.indra.es:19443/incms-ss-client-classic/netplusScreen.html";
			let url;
			if(this.methodSelected=="DEBIT"){
				/* WEBPAY INTEGRATION DETAILS
				 https://wppsandbox.mit.com.mx/recibe.jsp
				 https://wppsandbox.mit.com.mx/comparte.jsp
				*/
				url = "https://www.google.com.mx/"; //We should use default Thanks screen for mobile phone
				let data = {
					numOpOrigen: resp.data.reference,
					amount: Math.round(this.state.initParams.amount * 100) / 100,
					account: this.state.initParams.idPaymentForm,
					//For prepayment
					//oriAmountPre: Math.round(this.state.initParams.oriAmountPre * 100) / 100,
					//meterSerial: this.state.initParams.meterSerial,
					//urlForRedirection: url
				};
				generalService.getUrlIframeWebPay(data, this.onGetUrlIframe.bind(this));
			}else{
				url = "https://www.paypal.com/es/home";
				let data = {
					numOpOrigen: resp.data.reference,
					amount: Math.round(this.state.initParams.amount * 100) / 100,
					account: this.state.initParams.idPaymentForm,
					//For prepayment
					oriAmountPre: Math.round(this.state.initParams.oriAmountPre * 100) / 100,
					meterSerial: this.state.initParams.meterSerial,
					urlForRedirection: url
				};
				generalService.getUrlIframe(data, this.onGetUrlIframe.bind(this));
			}

		}else{
			TimerMixin.setTimeout(() => {
				this.setState({...err,spinnerVisible: false})
			}, 1000);
		}
	}

	onGetUrlIframe(err, resp){
		if(!err){
			//let fake = "https://www.test.indra-netplus.com/frontal/venta3ds2/iframeVenta3ds2.html?template=template3&formaPago=P&coCliente=AGPUEBLA&coComercio=WEB&coTerminal=00000001&fechaOpOrigen=04/02/2021%2010:48:54%20%2B0100&idioma=en&numOpOrigen=2020S0000000123&importe=70000&moneda=484&urlOk=https://tesla.indra.es:8254/t/icdesa3_viernes.tesla.indra.es/NetPlusRedirection/1.0.1/post?urlOk=https://www.paypal.com/es/home&urlKo=https://tesla.indra.es:8254/t/icdesa3_viernes.tesla.indra.es/NetPlusRedirection/1.0.1/post?urlKo=https://www.paypal.com/es/home&hash=7F107E17E2499C7D21739C41B59EA1B9A6682B77AC091A72411A24DD1698743B&codCollectionCenter=1002311&codSeedbed=NETPLUS_SB&account=2358&oriAmountPre=NaN&meterSerial="

			this.setState({
				htmlToShow: resp.url,showOptions:false
			});
		}else{
			if(this.methodSelected=="DEBIT"){
				console.log("Failed because of internet so"); //TODO QUITAR ESTO
				this.setState({
					htmlToShow: "https://wppsandbox.mit.com.mx/i/4X5QVJ9N",showOptions:false
				});
			}else{
				TimerMixin.setTimeout(() => {
					this.setState(err)
				}, 1000);
			}
		}
	}
	
	
	submit(method) {
		this.methodAlreadySelected(method);
	}

	paymentDone() {
		if(this.state.initParams.paymentDone){
			this.state.initParams.paymentDone();
		}
		if(this.state.program!=null && this.state.program.screen3!=null && this.state.program.screen3.length){
			TimerMixin.setTimeout(() => {
				this.props.navigation.navigate(this.state.program.screen3);
			}, 1000);
		}else{
			this.props.paymentRefresh();
			TimerMixin.setTimeout(() => {
				this.props.navigation.dispatch(backAction);
			}, 500);
		}
	}

	getParameterByName(name, url) {
		name = name.replace(/[\[\]]/g, '\\$&');
		var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
			results = regex.exec(url);
		if (!results) return null;
		if (!results[2]) return '';
		return decodeURIComponent(results[2].replace(/\+/g, ' '));
	}

	onNavigationStateChange(navState){
		if (navState.url) {

			//Netplus
			let errorCode = this.getParameterByName("errorCode",navState.url);
			let errorMsg = this.getParameterByName("errorMsg",navState.url);

			//WebPay - This was not really tested on adpDEV because there is no redirect
			if(errorCode==null){
				errorCode = this.getParameterByName("nbResponse",navState.url);
				errorMsg = this.getParameterByName("nb_error",navState.url);
			}

			if(errorCode!=null && errorMsg!=null){
				let message="";
				if(errorCode=="OK"){
					message=I18n.t("PAYMENT_SCREEN_OK");
				}else{
					message=I18n.t("PAYMENT_SCREEN_KO") + errorCode + " - " + errorMsg;
				}
				this.setState({
					messageAlert: createAlert(I18n.t("INFO"), message,{
						1: {
							key: 'button1',
							text: I18n.t('accept'),
							action: () => {								
								this.paymentDone();
							}
						}
					})
				});
			}
		}
	}

 
  render() {
    return (
      <Container>
        <Header {...this.props} noDrawer/>

        <SubHeader text={I18n.t('PAY')} back={true} {...this.props} />
        
        <PopupDialog refModal={this.state.messageAlert} />

		  {!this.state.showOptions?
		 <Content padderHorizontal style={{flex: 1}}>

			 {platformStyle.platform === 'android' ?
			  <WebView
				  source={{uri: this.state.htmlToShow}}
				  style={{flex: 1, height: platformStyle.deviceHeight-200, borderWidth: 1}}
				  onNavigationStateChange={ (navState)=>{ this.onNavigationStateChange(navState) }}
			  />:
			 <WebViewIOS
				 source={{uri: this.state.htmlToShow}}
				 style={{flex: 1, height: platformStyle.deviceHeight-200, borderWidth: 1}}
				 onNavigationStateChange={ (navState)=>{ this.onNavigationStateChange(navState) }}
			 />}
		  </Content>:
		  <Content padderHorizontal style={{flex: 1}}>
			  {this.state.paypalEnabled?
				  <Button style={{backgroundColor: platformStyle.brandPrimary, marginTop: 40}}
						  block
						  rounded
						  onPress={()=>{this.submit("PAYPAL")}}>
					  <Text sizeNormal>{I18n.t('PAYMENT_SCREEN_PAYPAL')}</Text>
				  </Button>:null}

			  {this.state.debitEnabled?
				  <Button style={{backgroundColor: platformStyle.brandPrimary, marginTop: 40}}
						  block
						  rounded
						  onPress={()=>{this.submit("DEBIT")}}>
					  <Text sizeNormal>{I18n.t('PAYMENT_SCREEN_DEBIT')}</Text>
				  </Button>:null}
		  </Content>}

	    <Spinner visible={this.state.spinnerVisible} textContent={this.state.loadingMsg}/>

		  {/*<Footer style={styles.footer}>
            <FooterTab>
              <Row>
	              <Button style={{backgroundColor: platformStyle.brandPrimary}}
	                block
	                rounded
	                onPress={this.props.handleSubmit(this.paymentDone.bind(this))}>
	                	<Text sizeNormal>Simular Pago</Text>
	              </Button>
              </Row>
            </FooterTab>
        </Footer>*/}
	    
      </Container>
    );
  }
}

const PaymentScreenForm = reduxForm({
  form: "PaymentScreenForm",
  enableReinitialize: true,
})(PaymentScreen);

const mapStateToProps = state => {
  return ({})
};

const bindAction = dispatch => {
  return {
	  paymentRefresh: () => dispatch(paymentRefresh()),
  };
};

export default connect(mapStateToProps, bindAction)(PaymentScreenForm);
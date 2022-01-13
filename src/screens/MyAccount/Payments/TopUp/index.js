import React, { Component } from "react";
import { Text, Button, Content, Container, Row, Body, Left, Right, View, Footer, FooterTab } from "native-base";
import { Keyboard, FlatList, Switch, TouchableOpacity } from 'react-native';
import I18n from 'react-native-i18n';
import { Field, reduxForm } from "redux-form";
import { connect } from 'react-redux';

import moment from 'moment-timezone';
import Config from 'react-native-config';

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
import { loadDate } from '../../../../actions/general';
import styles from './styles';


const backAction = NavigationActions.back({
  key: null
});



class TopUp extends Component {

	constructor( props ) {
		super(props);
		let additionalData = JSON.parse(repo.configuration.getField('accountAdditionalData'));
		let accountDetail = JSON.parse(repo.configuration.getField('accountDetail'));
		let balanceTxt = (accountDetail.contractData && accountDetail.contractData.balance && accountDetail.contractData.balance > 0 ) ? I18n.t('OVER_PAYMENT') : "";
		let balance = accountDetail.contractData && accountDetail.contractData.balance ? accountDetail.contractData.balance : "0";

		this.state = {
			spinnerVisible: false,
			meters: null,
			detailOpen: false,
			calculated: false,
			balanceTxt: balanceTxt,
			loadingMsg: I18n.t('Loading'),
			
			balance: balance,
			
			unitsPayment:0,
			ammountToPay: 0,
			prepaidDebt: 0,
			postpaidDebt: 0,
			topAmmount: 0,
			topUnits: 0,
			topUpDetail: null,
			
			...additionalData
		};
	}

	componentDidMount() {
		firebaseService.supervisorAnalytic('TOPUP'); 
		this.setState({spinnerVisible: true});

		let serviceInfo = JSON.parse(repo.configuration.getField('serviceInfo'));
		let idContractedService = serviceInfo.idContractedService;

		generalService.getMeters(idContractedService, function(err, resp){

			if(!err){

				let meters = resp.map(function(item){
					return {code: item.serialNum, val: item.serialNum };
				});

				this.setState({meters});
			}

			this.setState({spinnerVisible: false});
		}.bind(this));

	}


	showHideDetail(){
		this.setState({detailOpen: !this.state.detailOpen});
	}

	reset(){
		this.props.loadDate({total_payment: "0"});
		
		this.setState({
			detailOpen: false,
			calculated: false,
			ammountToPay: 0,
			prepaidDebt: 0,
			postpaidDebt: 0,
			topAmmount: 0,
			topUnits: 0
		});
	}


	calculate( values ){				

		this.setState({spinnerVisible: true, loadingMsg: I18n.t('CALCULATING')});

		let codUser = repo.configuration.getField('idCustomer');		
		let meterSerial = values.meter;
		
		if(values.total_payment){
			let totalPayment = values.total_payment;
			let debtPayment = 0;
			let data = {codUser, meterSerial, totalPayment, debtPayment};

			generalService.calculatePayment(data, function(err, resp){
				
				if(!err){
					let calculatedPayment = {
						ammountToPay: resp.unitsPayment + resp.debtPayment,
						prepaidDebt: resp.prepaidDebt,
						postpaidDebt: resp.percentageDebt,
						topAmmount: totalPayment - resp.debtPayment,
						topUnits: resp.units,
						topUpDetail: resp.unitsTopUp
					}
					this.setState({calculated: true, unitsPayment: resp.unitsPayment, ...calculatedPayment});
					
				}else if(err.messageAlert){
					this.setState({messageAlert: err.messageAlert});
				}else{
					this.showPopupAlert("Error", err);
				}

				this.setState({spinnerVisible: false});
			}.bind(this));
		}else{
			this.showPopupAlert("Error", I18n.t('NO_AMMOUNT'));
		}
	}

	renderItem({ item }){
		return (
			<Row style={styles.row}>
	             <Left padder flex06 style={sharedStyles.alignItems('center')}>
	        		<Text sizeNormal>{item.concept}</Text>
	             </Left>
	             <Right padder flex06 style={sharedStyles.alignItems('center')}>
	        		<Text sizeNormal>{item.amount}</Text>
	             </Right>
            </Row>	 
		);
	}

	_keyExtractor = ( item, index ) => index.toString();
	
	submit( values ) {

		this.showPopupAlert("Info", I18n.t('NETPLUS_DISABLED'));
		return;
		
		if(this.state.unitsPayment <= 0){
			this.showPopupAlert("Error", I18n.t('NO_AMMOUNT'));
		}else{
			let data = {
				oriAmountPre: values.total_payment,
				idPaymentForm: repo.configuration.getField("idPaymentForm"),
				meterSerial: values.meter,
				amount: this.state.ammountToPay,
				indPrepayment: true,
				listBills: null
			};
			repo.configuration.setField('adpProgramData',"");
			this.props.navigation.navigate('PaymentScreen', data);
		}
		
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
	  
	let color = this.state.balance < 0 ? "red":"black";
    return (
      <Container>
        <Header {...this.props} noDrawer/>

        <SubHeader text={I18n.t('TOP_UP')} back={true} {...this.props} />
        
        <PopupDialog refModal={this.state.messageAlert} />
        
        <Content padderHorizontal>
		     
        	<Field name="meter"
		            component={FormPicker}
		            validate={[ required ]}
		            inputLabel={I18n.t('Meter')}
		            borderBottomStyle
		            errorActive
		            dataItems={this.state.meters && this.state.meters.length ? this.state.meters : null}
		     />
		     
		     <Row style={styles.row}>
	             <Left flex04>
	               <Text sizeNormal light style={{color:color}}>{I18n.t('Balance')}</Text>
	             </Left>
	             <Body style={sharedStyles.alignItems('start')}>
	             	<CurrencyText heavy sizeNormal style={{color:color}} value={this.state.balance}>         
		  				{this.state.balanceTxt}
		            </CurrencyText>
	             </Body>
	         </Row>
	         
		     <Field name="total_payment"
                 component={FormField}
                 errorActive
                 inputLabel={I18n.t('TOTAL_PAYMENT') + " ("+getCurrencieName()+")"}
                 validate={[ required ]}
		     	 keyboardType={"numeric"}
                 light
                 input={{
                	 value: this.state.total_payment,
                	 onChange: (value)=>{
                    	 this.setState({total_payment: value.replace(",", ".")})
                     }
                 }}
                 
		     />
		     
	         <Row style={styles.row}>
	             <Left flex06>
	             	<Button style={{backgroundColor: platformStyle.brandPrimary}}
		                block
		                rounded
		                onPress={this.props.handleSubmit(this.calculate.bind(this))}>
		                	<Text sizeNormal>{I18n.t('CALCULATE')}</Text>
	                </Button>
	             </Left>
	             <Right flex06 style={sharedStyles.alignItems('start')}>
	             	<Button style={{backgroundColor: platformStyle.brandPrimary}}
		                block
		                rounded
		                onPress={this.reset.bind(this)}>
		                	<Text sizeNormal>{I18n.t('RESET')}</Text>
                    </Button>
	             </Right>
	         </Row>
	         
	         {
	        	 this.state.calculated ?
	        			 <Container>
		        	         <Row style={styles.row}>
		        	             <Left flex06>
		                     		<Text sizeNormal>{I18n.t('AMMOUNT_TO_PAY') + " ("+getCurrencieName()+")"}</Text>
		        	             </Left>
		        	             <Right flex06 style={sharedStyles.alignItems('end')}>
		                     		<Text sizeNormal>{this.state.ammountToPay}</Text>
		        	             </Right>
		        	         </Row>
	
		        	         <Row style={styles.row}>
		        	             <Left flex06>
		                     		<Text sizeNormal>{I18n.t('PREPAID_DEBT') + " ("+getCurrencieName()+")"}</Text>
		        	             </Left>
		        	             <Right flex06 style={sharedStyles.alignItems('end')}>
		                     		<Text sizeNormal>{this.state.prepaidDebt}</Text>
		        	             </Right>
		        	         </Row>
		        			 
	
		        	         <Row style={styles.row}>
		        	             <Left flex06>
		                     		<Text sizeNormal>{I18n.t('POSTPAID_DEBT') + " ("+getCurrencieName()+")"}</Text>
		        	             </Left>
		        	             <Right flex06 style={sharedStyles.alignItems('end')}>
		                     		<Text sizeNormal>{this.state.postpaidDebt}</Text>
		        	             </Right>
		        	         </Row>
		        	         
	
		        	         <Row style={styles.row}>
		        	             <Left flex06>
		                     		<Text sizeNormal>{I18n.t('TOPUP_AMMOUNT') + " ("+getCurrencieName()+")"}</Text>
		        	             </Left>
		        	             <Right flex06 style={sharedStyles.alignItems('end')}>
		                     		<Text sizeNormal>{this.state.topAmmount}</Text>
		        	             </Right>
		        	         </Row>
	
	
		        	         <Row style={styles.row}>
		        	             <Left flex06>
		                     		<Text sizeNormal>{I18n.t('TOPUP_UNITS') + " (kWh)"}</Text>
		        	             </Left>
		        	             <Right flex06 style={sharedStyles.alignItems('end')}>
		                     		<Text sizeNormal>{this.state.topUnits}</Text>
		        	             </Right>
		        	         </Row>
		        	         
		        	         
		        	         <TouchableOpacity style={styles.flexDirection} onPress={this.showHideDetail.bind(this)}>
					             <View>
					               <IconFontello name={this.state.detailOpen ? "minus":"plus"} size={20} style={{ color: platformStyle.brandPrimary }}/>
					             </View>
					             <Text sizeNormal> {I18n.t("TOPUP_DETAIL")}</Text>
				             </TouchableOpacity>
		        	         
				             
				             {
				            	 this.state.detailOpen ? 
				            		<Container> 	
				        	         <Row style={styles.row}>
				        	             <Left padder flex06 style={sharedStyles.alignItems('center')}>
				                     		<Text heavy>{I18n.t('CONCEPT')}</Text>
				        	             </Left>
				        	             <Right padder flex06 style={sharedStyles.alignItems('center')}>
				                     		<Text heavy>{I18n.t('AMMOUNTS')}</Text>
				        	             </Right>
				        	         </Row>	 
				        	         <FlatList data={this.state.topUpDetail}
						 			        style={sharedStyles.margin('bottom', 5)}
						 			        renderItem={this.renderItem.bind(this)}
						 			        keyExtractor={this._keyExtractor}
						 	        		ItemSeparatorComponent={ () => <View style={ { width: '100%', height: 1, backgroundColor: "#CED0CE", margin: 5 } } /> }
						 	         />
						 	        </Container>
				            	:
				            		null
				            	 
				        	  }
				             
	        	         </Container>
	        	:
	        		null
	         }
	         
        </Content>

	    <Spinner visible={this.state.spinnerVisible} textContent={this.state.loadingMsg}/>	
   
    	<Footer style={styles.footer}>
            <FooterTab>
              <Row>
	              <Button style={{backgroundColor: platformStyle.brandPrimary}}
	                block
	                rounded
	                onPress={this.props.handleSubmit(this.submit.bind(this))}>
	                	<Text sizeNormal>{I18n.t('GO_PAY')}</Text>
	              </Button>
              </Row>
            </FooterTab>
        </Footer>
	    
      </Container>
    );
  }
}

const TopUpForm = reduxForm({
  form: "TopUpForm",
  enableReinitialize: true,
})(TopUp);

const mapStateToProps = state => {
  return ({
	   initialValues: state.generalReducer.loadDate,
  })
};

const bindAction = dispatch => {
  return {
	   loadDate: ( formData ) => dispatch(loadDate(formData)),
  };
};

export default connect(mapStateToProps, bindAction)(TopUpForm);

import React, { Component } from "react";
import { Image } from 'react-native';
import { Container, Text, View } from "native-base";
import styles from './styles';
import moment from 'moment-timezone';
import { connect } from 'react-redux';

import Header from '../../../components/Header';
import {getCurrencieName, formatValue} from '../../../components/CurrencyText';
import DetailTabs from '../DetailTabs/';
import SummaryTabs from '../SummaryTabs/';
import I18n from 'react-native-i18n';
import {platformStyle} from "../../../theme";
import SubMenu from '../SubMenu';
import {
  VictoryChart,
  VictoryAxis,
  VictoryBar,
  VictoryLegend
} from 'victory-native';
import generalService from "../../../services/general/generalService";
import waterfall from "async/waterfall";
import PopupDialog from '../../../components/PopupDialog/';
import Spinner from '../../../components/Spinner';
import repo from '../../../services/database/repository'
import firebaseService from "../../../services/firebase/firebaseService";
import TimerMixin from "react-timer-mixin";
import Swiper from 'react-native-swiper';
import NegativeAwareTickLabel from '../../../components/NegativeAwareTickLabel/';
import {paymentRefreshed} from '../../../actions/general';

class AccountSummaryPayment extends Component {

  constructor( props ) {
    super(props);

    const { params } = this.props.navigation.state;


    if(params){
    	repo.configuration.setField("isPrepWithTelecontrol", params.codServiceRateType === '240TYSERRA');
    }
    
    this.state = {
      data: [],
      data2: [],
      spinnerVisible: false,
      reRender: null,
      indPrepayment: null,
      isPrepWithTelecontrol: repo.configuration.getField("isPrepWithTelecontrol")
    };
  }

  componentDidMount() {

    firebaseService.supervisorAnalytic('BILLGRAPH');
    const { params } = this.props.navigation.state;

    if(params && params.origin ) {
	  this.loadData();
    } else {
      this.LoadBdData();
    }
  }

	loadData(){
		this.setState({
			spinnerVisible: true
		}, function() {
			repo.configuration.setField('bills', JSON.stringify({}));
			repo.configuration.setField('recharges', JSON.stringify({}));
			this.LoadAllData();
		}.bind(this));
	}

	componentWillReceiveProps( nextProps ) {
		if( this.props.paymentRefresh !== nextProps.paymentRefresh  ) {
			//console.log("SummaryPayment -> paymentRefresh");
			this.loadData();
		}
	}


  //This gonna add the last 12 previous months with no ammounts
  addEmptyMonths(data){

	  if(!data)data = [];
	  
	  let date = new Date();  
	  for(var i=0; i<12; i++){
		  let m = date.getMonth();
		  if(m == 0 && i>0){
			  date.setYear(date.getFullYear() - 1);
			  m = 11;
		  }else if(i>0){
			  m --;
		  }
		  date.setMonth( m );
		  data.push({
			  purchaseDate: date.getTime(),
			  emissionDate: date.getTime(),
			  amount: 0,
			  billAmount: 0,
			  billPendAmount: 0
		  });
	  }
	  return data;
  }
  
  generateFormatedData(data, indPrepayment){
	  let timeZone = repo.configuration.getField("timeZone");
	  let formattedData = [];
	  let _month;
	  let _amount = 0;
	  let _pending = 0;
	  let monthNumber = 0;
	  //First add empty months to the data array
	  data = this.addEmptyMonths(data);
	  
	  //Then order it
	  data = _.chain(data).orderBy(indPrepayment && !this.state.isPrepWithTelecontrol ? 'purchaseDate' : 'emissionDate').value();

	  //And group data by month
	  for(let i=0; i<data.length;i++) {
		  
		  let item = data[i];
		  let itemDate = moment.tz(new Date(indPrepayment && !this.state.isPrepWithTelecontrol ? item.purchaseDate : item.emissionDate), timeZone);
		  let _month_aux = itemDate.format('MMMYY');
		  monthNumber = new Date(indPrepayment && !this.state.isPrepWithTelecontrol ? item.purchaseDate : item.emissionDate).getMonth();
		  
		  if(!_month){
			  _month = _month_aux;
		  }
		  
		  if(_month_aux !== _month){
			  formattedData.push({
				  y: _amount,
				  x: _month,
				  fill: "#004B8D",
				  monthNumber
			  });
			  
			  if(_pending > 0){
				  formattedData.push({
					  y: _pending,
					  x: _month,
					  fill: "#C62828",
					  monthNumber
				  });
			  }
			  _month = _month_aux;
			  _amount = 0;
			  _pending = 0;
		  }

		  
		  _amount += indPrepayment && !this.state.isPrepWithTelecontrol ? item.amount : item.billAmount;
		  
		  if(!indPrepayment && item.billPendAmount){
			  _pending += item.billPendAmount;
		  }
	  }

	  formattedData.push({
		  y: _amount,
		  x: _month,
		  fill: "#004B8D",
		  monthNumber
	  });
  
	  if(_pending > 0){
		  formattedData.push({
			  y: _pending,
			  x: _month,
			  fill: "#C62828",
			  monthNumber
		  });
	  }
	  
	  //now we gonna split data in two arrays with six months
	  let monthsFounds = 0;
	  let actual;
	  let indexToSplit = 0;
	  for(let i=0; i<formattedData.length && monthsFounds <= 6;i++){
		  if(formattedData[i].monthNumber != actual){
			  actual = formattedData[i].monthNumber;
			  monthsFounds++;
			  indexToSplit = i;
		  }
	  }

	  let ret = {
		  data: formattedData.slice(0, indexToSplit), ///first six months
		  data2: formattedData.slice(indexToSplit, formattedData.length) //Seconds six months
	  };

	  return ret;
  }
  
  
  LoadBdData() {
	let accountServices = JSON.parse(repo.configuration.getField('accountServices'));
	  if (accountServices && accountServices.length>0){
		let AdditionalData = JSON.parse(repo.configuration.getField('accountAdditionalData'));
		let data = AdditionalData.indPrepayment && !this.state.isPrepWithTelecontrol ? JSON.parse(repo.configuration.getField('recharges')) : JSON.parse(repo.configuration.getField('bills') );
		data = this.generateFormatedData(data, AdditionalData.indPrepayment && !this.state.isPrepWithTelecontrol);
		this.setState({
			indPrepayment: AdditionalData.indPrepayment && !this.state.isPrepWithTelecontrol,
			reRender: new Date().valueOf(),
			...data
		});
	  }
  }

  LoadAllData() {

    let idPaymentForm = repo.configuration.getField('idPaymentForm');
    let AdditionalData = null;
    let data = null;
    let serviceInfo = JSON.parse(repo.configuration.getField('serviceInfo'));

    waterfall([
      ( callback ) => {
        generalService.AccountServicesAction(idPaymentForm, callback);
      },
      ( arg1, callback ) => {

        generalService.AccountDetailAction(idPaymentForm, callback);
      },
      ( arg1, callback ) => {

        generalService.AccountAdditionalDataAction(idPaymentForm, serviceInfo.idContractedService,callback);
      },
      ( arg1, callback ) => {

        generalService.AccountAgreementAction(idPaymentForm, callback);
      },
      ( arg1, callback ) => {
        AdditionalData = JSON.parse(repo.configuration.getField('accountAdditionalData'));
        let services = JSON.parse(repo.configuration.getField('accountServices'));
        if( services && services.length && services[ 0 ].idContractedService )
          if( AdditionalData && AdditionalData.indPrepayment && !this.state.isPrepWithTelecontrol )
            generalService.LoadRechargesAction(idPaymentForm, AdditionalData.idService, callback);
          else            
			  generalService.LoadDocumentsAction(idPaymentForm, callback);			  
        else
          return callback('Data no found', null)
      }
    ], ( err, result ) => {
      this.setState({ spinnerVisible: false },
        function() {
          if( !err ) {
            data = (AdditionalData && AdditionalData.indPrepayment && !this.state.isPrepWithTelecontrol) ? JSON.parse(repo.configuration.getField('recharges')) : JSON.parse(repo.configuration.getField('bills'));
            data = this.generateFormatedData(data, AdditionalData.indPrepayment && !this.state.isPrepWithTelecontrol);
                        
            this.setState({
              indPrepayment: AdditionalData.indPrepayment && !this.state.isPrepWithTelecontrol,
              reRender: new Date().valueOf(),
              spinnerVisible: false,
              ...data,
            });
			  
			  
			this.props.paymentRefreshed();
          } else {
            TimerMixin.setTimeout(() => {
              this.showPopupAlert('', err);
            }, 1000);

          }
        }.bind(this));

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

  render() {

    return (
      <Container>
        <Header noDrawer {...this.props}
                iconAction={'ios-home-outline'}/>
        <SubMenu title={I18n.t("ACCOUNT_SUMMARY")} {...this.props} reRender={this.state.reRender}
                 indPrepayment={this.state.indPrepayment}/>
        <PopupDialog
          refModal={this.state.messageAlert}
        />
	    <SummaryTabs {...this.props} indPrepayment={this.state.indPrepayment} isPrepWithTelecontrol={this.state.isPrepWithTelecontrol}/>
        
        {this.state.indPrepayment ? 
          <Text style={{padding:5}}>{I18n.t("PURCHASE_IN") + getCurrencieName()}</Text>
          :
          <Text style={{padding:5}}>{I18n.t("BILLS_IN") + getCurrencieName()}</Text>
	    }
	    
        <Swiper style={styles.wrapper} 
        	showsButtons={true} 
        	index={1}
        	loadMinimal={true}
        	loop={false}
        	activeDotStyle={{backgroundColor: 'transparent'}}
        	dotStyle={{backgroundColor: 'transparent'}}
        	buttonWrapperStyle={styles.buttonWrapper}
        	nextButton={<Text style={{...styles.buttonText, color: platformStyle.brandPrimary}}>›</Text>}
        	prevButton={<Text style={{...styles.buttonText, color: platformStyle.brandPrimary}}>‹</Text>}
        >
        
	        <View style={styles.slide1} pointerEvents="box-only">
	        	<VictoryChart
		            domainPadding={{ x: 25 }}>
		         
		            <VictoryBar
		              data={this.state.data}
		              labels={d => d.x}
		              style={{
		                data: { fill: d => d.fill },
		                labels: { angle: -45 }
		              }}
		              labelComponent={<NegativeAwareTickLabel />}
		            />
		            <VictoryAxis style={{ tickLabels: { fill: "none" } }}  />
		            <VictoryAxis dependentAxis tickFormat={(t) => `${t ? formatValue(t, false, false) : t}`} />
		            <VictoryLegend x={(platformStyle.deviceWidth/2) - 50} y={0}
		                orientation="horizontal"
		                gutter={20}
		                style={{ border: { stroke: "none" }, title: {fontSize: 20 } }}
		                data={[
		                  { name: I18n.t("PAID"), symbol: { fill: "#004B8D" } },
		                  { name: I18n.t("UNPAID"), symbol: { fill: "#C62828" } },
		                ]}
		            />
	            </VictoryChart>
	        </View>
	        <View style={styles.slide1} pointerEvents="box-only">
		        <VictoryChart
		            domainPadding={{ x: 15 }}>
		         
		            <VictoryBar
		              data={this.state.data2}
		              labels={d => d.x}
		              style={{
		                data: { fill: d => d.fill },
		                labels: { angle: -45 }
		              }}
		              labelComponent={<NegativeAwareTickLabel />}
		            />
		            <VictoryAxis style={{ tickLabels: { fill: "none" } }}  />
		            <VictoryAxis dependentAxis tickFormat={(t) => `${t ? formatValue(t, false, false) : t}`} />
		            <VictoryLegend x={(platformStyle.deviceWidth/2) - 50} y={0}
		                orientation="horizontal"
		                gutter={20}
		                style={{ border: { stroke: "none" }, title: {fontSize: 20 } }}
		                data={[
		                  { name: I18n.t("PAID"), symbol: { fill: "#004B8D" } },
		                  { name: I18n.t("UNPAID"), symbol: { fill: "#C62828" } },
		                ]}
		            />
		        </VictoryChart>
	        </View>
	    </Swiper>
    
        <Spinner visible={this.state.spinnerVisible} textContent={I18n.t('Loading')}
                 overlayColor={`rgba(0, 0, 0, 0.60)`}
                 textStyle={{ color: '#FFF' }}/>
        <DetailTabs {...this.props} indPrepayment={this.state.indPrepayment}/>
      </Container>
    );

  }
}


const bindAction = dispatch => {
	return {
		paymentRefreshed: () => dispatch(paymentRefreshed()),
	};
};

const mapStateToProps = state => {
	return {
		paymentRefresh: state.generalReducer.paymentRefresh
	}
};


export default connect(mapStateToProps, bindAction)(AccountSummaryPayment);
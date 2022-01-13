import React, { Component } from "react";
import { Image } from "react-native";
import { Container, Text, Content, View } from "native-base";
import { Field, reduxForm, formValueSelector } from "redux-form";

import {formatValue} from '../../../components/CurrencyText';
import PopupDialog from '../../../components/PopupDialog/';
import { loadDataFormConsumption } from '../../../actions/general'
import { connect } from 'react-redux';
import Header from '../../../components/Header';
import DetailTabs from '../DetailTabs/';
import ConsumptionTabs from '../ConsumptionTabs/';
import FormPicker from '../../../components/FormPicker/'
import NoDataFound from '../../../components/NoDataFound/';
import I18n from 'react-native-i18n';
import sharedStyles from '../../../shared/styles'
import SubMenu from '../SubMenu';
import {
  VictoryChart,
  VictoryAxis,
  VictoryBar
} from 'victory-native';
import generalService from "../../../services/general/generalService";
import waterfall from "async/waterfall";
import repo from '../../../services/database/repository'
import Spinner from '../../../components/Spinner';
import Swiper from 'react-native-swiper';
import styles from './styles';

import moment from 'moment-timezone';
import TimerMixin from "react-timer-mixin";
import NegativeAwareTickLabel from '../../../components/NegativeAwareTickLabel/';
import {platformStyle} from "../../../theme";

class AccountConsumptionPayment extends Component {

  constructor( props ) {
    super(props);

    let idContractedService = JSON.parse(repo.configuration.getField('serviceInfo')).idContractedService;
   
    this.state = {
      data: [],
      data2:[],
      meters: [],
      spinnerVisible: false,
      Retrieving: false,
      idContractedService
    }; 
  }

  componentDidMount() {
    const { params } = this.props.navigation.state;

    if( params && params.origin ) {
      repo.configuration.setField('consumptionMeter', null);
      repo.configuration.setField('consumptionUsage', null);
      repo.configuration.setField('consumptionLoadData', JSON.stringify({}));
      this.LoadData();
    } else {
      this.LoadBdData();
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
			  readingDate: date.getTime(),
			  consumValue: 0,
		  });
	  }
	  return data;
  }
  
  generateFormatedData(data){
	  let timeZone = repo.configuration.getField("timeZone");
	  let formattedData = [];
	  let _month;
	  let _amount = 0;
	  let monthNumber = 0;
	  //First add empty months to the data array
	  data = this.addEmptyMonths(data);
	  
	  //Then order it
	  data = _.chain(data).orderBy('readingDate').value();

	  //And group data by month
	  for(let i=0; i<data.length;i++) {
		  let item = data[i];
		  let itemDate = moment.tz(new Date(item.readingDate), timeZone);
		  let _month_aux = itemDate.format('MMM YY');
		  monthNumber = new Date(item.readingDate).getMonth();
		  
		  if(!_month){
			  _month = _month_aux;
		  }
		  
		  if ( _month_aux !== _month) {
			  formattedData.push({
				  y: _amount,
				  x: _month,
				  fill: "#004B8D",
				  monthNumber
			  });
			  _month = _month_aux;
			  _amount = 0;
		  } 
		  _amount += item.consumValue;
	  }

	  formattedData.push({
		  y: _amount,
		  x: _month,
		  fill: "#004B8D",
		  monthNumber
	  });
	  
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
    let metersData = JSON.parse(repo.configuration.getField('consumptionMeters'));
    let meters = [];
	let data = [];
    _.map(metersData, function( item ) {
      _.map(item.usages, function( item2 ) {
        meters.push({
          code: `${item.idDevice}-${item2.code}`, val: `${item.serialNum} - ${item2.description}` , ordenado: `${item2.code}`
        })
      })
    });

    let consumptionLoadData = JSON.parse(repo.configuration.getField('consumptionLoadData'));

    if(consumptionLoadData.data && consumptionLoadData.data.usages){
        data = this.generateFormatedData(consumptionLoadData.data.usages);
    }

    this.setState({
      ...data,
      meters
    }, function() {
      this.props.loadDataFormConsumption({
        meter: repo.configuration.getField('consumptionMeter'),
        idContractedService: this.state.idContractedService
      });
    }.bind(this));
  }


  LoadData() {

    waterfall([
      ( callback ) => {
        this.setState({ spinnerVisible: true });
        if(this.state.idContractedService){
          generalService.LoadMetersAction(this.state.idContractedService, callback);
        }
      }
    ], ( err, result ) => {
      this.setState({ spinnerVisible: false });
      if( !err ) {
        let meters = [];
        _.map(result.data, function( item ) {
          _.map(item.usages, function( item2 ) {
            meters.push({
              code: `${item.idDevice}-${item2.code}`, val: `${item.serialNum} - ${item2.description}` , ordenado: `${item2.code}`
            })
          })
        });

        meters.sort((a,b) => a.ordenado.localeCompare(b.ordenado));

        this.setState({ meters: meters });
        
        if( meters.length ){
	        this.props.loadDataFormConsumption({
	            meter: meters[ 0 ].code,
	            idContractedService: this.state.idContractedService
	        });
	        
	        let dataMeterUsage = meters[ 0 ].code.split("-");
	        this.LoadUsage(dataMeterUsage[ 0 ], dataMeterUsage[ 1 ]);
	    }else{
	    	this.setState({ spinnerVisible: false });
	    }
        

      } else {
        this.setState({ spinnerVisible: false }, function() {
          TimerMixin.setTimeout(() => {
            this.showPopupAlert(I18n.t("INFO"), I18n.t("NO_DATA"));
          }, 1000);
        });
      }
    })
  }

  LoadUsage( idDevice, TypeConsumption ) {


    this.setState({ data: [], data2: [], Retrieving: true, spinnerVisible: true },
      function() {


        waterfall([
          ( callback ) => {
              if(this.state.idContractedService){
            	  generalService.LoadUsagesAction(this.state.idContractedService, idDevice, TypeConsumption, callback);
              } else {
	              this.setState({ spinnerVisible: false }, function() {
	                TimerMixin.setTimeout(() => {
	                  this.showPopupAlert(I18n.t("NO_DATA"), I18n.t("RETRY"));
	                }, 1000);
	              });
              }
          },
        ], ( err, result ) => {

          this.setState({ spinnerVisible: false }, function() {
            if( !err ) {
            	let data = this.generateFormatedData(result.data.usages);
            	this.setState({ ...data });
            } else {
              TimerMixin.setTimeout(() => {
                this.showPopupAlert(I18n.t("INFO"), I18n.t("NO_DATA"));
              }, 1000);
            }
          });
        })
      });

    // }

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

  componentWillReceiveProps( nextProps ) {
	 
	  if(this.state.idContractedService != nextProps.dataForm.idContractedService){
		  return;
	  }

	  if(this.props.dataForm.meter && this.props.dataForm.meter !== nextProps.dataForm.meter){
		  repo.configuration.setField('consumptionMeter', nextProps.dataForm.meter);
		  repo.configuration.setField('consumptionLoadData', JSON.stringify({}));
		  this.props.loadDataFormConsumption({
			  meter: repo.configuration.getField('consumptionMeter'),
			  idContractedService: this.state.idContractedService
		  });
		  let dataMeterUsage = nextProps.dataForm.meter;
		  dataMeterUsage = dataMeterUsage.split("-");
		  this.LoadUsage(dataMeterUsage[ 0 ], dataMeterUsage[ 1 ]);
	  }

  }
  
  onChangeMeter(value){
	  
	  repo.configuration.setField('consumptionMeter', value);
	  repo.configuration.setField('consumptionLoadData', JSON.stringify({}));
	  this.props.loadDataFormConsumption({
		  meter: value,
		  idContractedService: this.state.idContractedService
	  });
	  let dataMeterUsage = value.split("-");
	  this.LoadUsage(dataMeterUsage[ 0 ], dataMeterUsage[ 1 ]);
  }


  render() {


    return (
      <Container>
        <Header noDrawer {...this.props}
                iconAction={'ios-home-outline'}/>
        <SubMenu title={I18n.t("MY_CONSUMPTIONS")} {...this.props} />

        <ConsumptionTabs {...this.props}/>
        <PopupDialog
          refModal={this.state.messageAlert}
        />
          {this.state.meters && this.state.meters.length ?
            <Field name="meter"
                   //contentStyle={sharedStyles.margin('top')}
                   component={FormPicker}
                   inputLabel={I18n.t('METER_USAGE')}
                   borderBottomStyle
                   noSelect={true}
                   dataItems={this.state.meters}
          		   onChange={this.onChangeMeter.bind(this)}
            /> : null}
	          {(this.state.data || this.state.data2) && (this.state.data.length || this.state.data2.length) ?
	
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
						            domainPadding={{ x: 15 }}>
						         
						        	<VictoryBar
						              data={this.state.data}
						              labels={d => d.x}
						              style={{
						                data: { fill: d => d.fill },
						                labels: { angle: -45 },
						              }}
						              labelComponent={<NegativeAwareTickLabel />}
						            />
						            <VictoryAxis style={{ tickLabels: { fill: "none" } }}  />
						            <VictoryAxis dependentAxis tickFormat={(t) => `${t ? formatValue(t, false, false) : t}`} />
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
						                labels: { angle: -45 },
						              }}
						              labelComponent={<NegativeAwareTickLabel />}
						            />
						            <VictoryAxis style={{ tickLabels: { fill: "none" } }}  />
						            <VictoryAxis dependentAxis tickFormat={(t) => `${t ? formatValue(t, false, false) : t}`} />
						        </VictoryChart>
					        </View>
					   </Swiper>
	            : <NoDataFound />}
        <Spinner visible={this.state.spinnerVisible} textContent={I18n.t('Loading')}
                 overlayColor={`rgba(0, 0, 0, 0.60)`}
                 textStyle={{ color: '#FFF' }}/>
        <DetailTabs {...this.props} />
      </Container>
    );

  }
}


const AccountConsumptionPaymentPage = reduxForm({
  form: "AccountConsumptionPaymentForm"
})(AccountConsumptionPayment);

function bindAction( dispatch ) {
  return {
    loadDataFormConsumption: ( formData ) => dispatch(loadDataFormConsumption(formData)),
  };
}

const selector = formValueSelector('AccountConsumptionPaymentForm');
const mapStateToProps = state => {
  return {
    dataForm: selector(state, 'meter', 'idContractedService', 'usageType'),
    initialValues: state.generalReducer.formDataConsumption
  }
};

export default connect(mapStateToProps, bindAction)(AccountConsumptionPaymentPage);

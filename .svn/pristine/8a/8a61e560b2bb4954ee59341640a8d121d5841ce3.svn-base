import React, { Component } from "react";
import { Image } from 'react-native';
import { Container, Text, Content, View } from "native-base";
import moment from 'moment-timezone';

import {formatValue} from '../../../components/CurrencyText';
import Header from '../../../components/Header';
import DetailTabs from '../DetailTabs/';
import SummaryTabs from '../SummaryTabs/';
import I18n from 'react-native-i18n';
import {platformStyle} from "../../../theme";
import SubMenu from '../SubMenu';
import {
  VictoryChart,
  VictoryBar,
  VictoryAxis
} from 'victory-native';
import Spinner from '../../../components/Spinner';
import repo from '../../../services/database/repository'
import firebaseService from "../../../services/firebase/firebaseService";
import styles from './styles';
import Swiper from 'react-native-swiper';
import NegativeAwareTickLabel from '../../../components/NegativeAwareTickLabel/';


class AccountSummaryUnits extends Component {

  constructor( props ) {
    super(props);

    this.state = {
      data: [],
      data2: [],
      spinnerVisible: false,
      reRender: null,
      indPrepayment: null
    };
  }

  componentDidMount() {

    firebaseService.supervisorAnalytic('UNITS');


    const { params } = this.props.navigation.state;


    if( params && params.origin ) {
      this.setState({
        spinnerVisible: true,
      }, function() {
        repo.configuration.setField('bills', JSON.stringify({}));
        repo.configuration.setField('recharges', JSON.stringify({}));

        this.LoadAllData();
      }.bind(this));
    } else {
      this.LoadBdData();
    }

  }

  LoadBdData() {
    let AdditionalData = JSON.parse(repo.configuration.getField('accountAdditionalData'));
    let data = AdditionalData.indPrepayment ? JSON.parse(repo.configuration.getField('recharges')) : JSON.parse(repo.configuration.getField('bills'));
    data = this.generateFormatedData(data);
    
    this.setState({
      indPrepayment: AdditionalData.indPrepayment,
      ...data,
      reRender: new Date().valueOf()
    });
  }

  LoadAllData() {

    let idPaymentForm = repo.configuration.getField('idPaymentForm');
    let data = repo.configuration.getField('recharges');
    data = this.generateFormatedData(data);
    
    this.setState({ ...data, idPaymentForm })
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
			  units: 0,
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
	  data = _.chain(data).orderBy('purchaseDate').value();

	  //And group data by month
	  for(let i=0; i<data.length;i++) {
		  let item = data[i];
		  let itemDate = moment.tz(new Date(item.purchaseDate), timeZone);
		  let _month_aux = itemDate.format('MMM YY');
		  monthNumber = new Date(item.purchaseDate).getMonth();

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
		  
		  _amount += item.units;
		  
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
  
  
  

  render() {
    
    return (
      <Container>
        <Header noDrawer {...this.props}
                iconAction={'ios-home-outline'}/>
        <SubMenu title={I18n.t("ACCOUNT_SUMMARY")} {...this.props} reRender={this.state.reRender}
                 indPrepayment={this.state.indPrepayment}/>

        <SummaryTabs {...this.props} indPrepayment={this.state.indPrepayment}/>

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
        <Spinner visible={this.state.spinnerVisible} textContent={I18n.t('Loading')}
                 overlayColor={`rgba(0, 0, 0, 0.60)`}
                 textStyle={{ color: '#FFF' }}/>
        <DetailTabs {...this.props} indPrepayment={this.state.indPrepayment}/>
      </Container>
    );

  }
}

export default AccountSummaryUnits;
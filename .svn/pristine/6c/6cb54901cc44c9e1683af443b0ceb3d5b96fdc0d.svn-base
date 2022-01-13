import React, { Component } from "react";
import { Image, TouchableOpacity } from "react-native";
import { Container, Text, View, Icon } from "native-base";
import { Field, reduxForm, formValueSelector } from "redux-form";

import PopupDialog from '../../../components/PopupDialog/';
import { loadDataFormConsumption } from '../../../actions/general'
import { connect } from 'react-redux';
import Header from '../../../components/Header';
import DetailTabs from '../DetailTabs/';
import ConsumptionTabs from '../ConsumptionTabs/';
import I18n from 'react-native-i18n';
import SubMenu from '../SubMenu';
import generalService from "../../../services/general/generalService";
import repo from '../../../services/database/repository'
import Spinner from '../../../components/Spinner';
import ButtonGroup from '../../../components/ButtonGroup';
import ScrollChart from '../../../components/ScrollChart';

import moment from 'moment-timezone';
import MonthPicker from '../../../components/MonthPicker/';
import {platformStyle} from "../../../theme";

class ConsumptionCurve extends Component {

  constructor( props ) {
	  super(props);

	  let serviceInfo = JSON.parse(repo.configuration.getField('serviceInfo'));
	  let timeZone = repo.configuration.getField('timeZone');
	  let idContractedService = serviceInfo.idContractedService;
	  
	  let today = new Date();
	  let year = new Date();
	  year.setMonth(today.getMonth() - 12);

	  let dates = {
		  rawDateFrom: year,
		  rawDateTo: today,
		  dateFrom: moment(year).format("MM-YYYY"),
		  dateTo: moment(today).format("MM-YYYY")
	  };
	  
	  //Set default dates
	  this.props.loadDataFormConsumption(dates);
	  
	  this.state = {
		  data: [],
		  spinnerVisible: false,
		  dismiss: false,
		  selectedIndex: 0,
		  idContractedService,
		  timeZone,
		  ...dates
	  };
  }

  
  
  
  //Onmount load months
  componentDidMount() {
	  this.setState({spinnerVisible: true}, this.loadMonths.bind(this));
  }

  
  onClickDateFrom(value){
	  let selectedDate = this.state.dateFrom.split("-");
	  selectedDate = new Date(selectedDate[1], selectedDate[0] -1, 1).getTime();
	  let content = (
		  <MonthPicker 
		  	onAccept={this.onAccceptDateFrom.bind(this)} 
		  	onCancel={this.onCancelDate.bind(this)}
		  	selectedDate={selectedDate}
		  />
	  );

	  this.setState({dismiss: false});
	  this.showPopupAlert(I18n.t("YEAR_MONTH_SELECTION"), "", content, {});

  }

  onClickDateTo(value){
	  let selectedDate = this.state.dateTo.split("-");
	  selectedDate = new Date(selectedDate[1], selectedDate[0], 0).getTime();
	  let content = (
		  <MonthPicker 
		  	onAccept={this.onAccceptDateTo.bind(this)} 
		  	onCancel={this.onCancelDate.bind(this)} 
		  	selectedDate={selectedDate}
		  />
	  );

	  this.setState({dismiss: false});
	  this.showPopupAlert(I18n.t("YEAR_MONTH_SELECTION"), "", content, {});
  }
  
  
  onAccceptDateFrom(month, year){
	  let value = new Date(year, month - 1, 1);
	  value = moment(value).format("MM-YYYY");
	  this.setState({dismiss: true, dateFrom: value}, this.loadMonths.bind(this));
  }
  
  onAccceptDateTo(month, year){
	  let value = new Date(year, month, 0);
	  value = moment(value).format("MM-YYYY");
	  this.setState({dismiss: true, dateTo: value}, this.loadMonths.bind(this));
  }
  
  onCancelDate(){
	  console.log("onCancelDate")
	  this.setState({dismiss: true});
  }
  

  
  //Load from WS
  load(from, to, period, onFinish){

	  let data = {
		  dateFrom: moment(from).format("YYYY-MM-DD"),
		  dateTo: moment(to).format("YYYY-MM-DD"),
		  curvePeriod: period
	  };

	  this.setState({spinnerVisible:true});
	  generalService.getReadCurvePeriod(this.state.idContractedService, data, function(err, resp){

		  if(!err){
			  onFinish(resp);		  
		  }else if(err.messageAlert){
			  this.setState({messageAlert: err.messageAlert});
		  }else{
			  this.showPopupAlert("Error", err);
		  }

		  this.setState({spinnerVisible:false});

	  }.bind(this));

  }
  
  loadMonths(){
	  
	  let from = this.state.dateFrom.split("-");
	  let to = this.state.dateTo.split("-");
	  
	  from = new Date([from[1], from[0], "01"].join("-"));
	  to = new Date([to[1], to[0], "01"].join("-"));
	  to = new Date(to.getFullYear(), to.getMonth() + 1, 0); //Set to last month day

	  
	  if(from.getTime() < to.getTime()){

		  this.load(from, to, "MONTHS", function(resp){
			  
			  let months = this.addEmptyMonths(null, moment(from).format("YYYY-MM-DD"), moment(to).format("YYYY-MM-DD"));
			  //Search each month and group responsed data
			  months = months.map(function(item){
				  for(var i=0; i<resp.length; i++){
					  let date = new Date(resp[i].fd + "-01");
					  if(item.year == date.getFullYear() && item.month == date.getMonth()+1){
						  item.y += resp[i].rv;
					  }
				  }

				  return item;
			  });
			  this.setState({data: months, selectedIndex: 0});
			  
		  }.bind(this));
	  }else{
		  this.showPopupAlert("Error!", I18n.t("TO_GREATER_THAN_FROM"));
	  }
	  
  }
  
  
  loadDays(item){
	  
	  if(!item){
		  item = this.state.storedDays;
	  }
	  
	  if(!item){
		  return;  
	  }

	  let datum = item.datum;
	  let firstDayMonth = new Date(datum.year, datum.month-1, 1);
	  let lastDayMonth = new Date(datum.year, datum.month, 0);

	  this.load(firstDayMonth, lastDayMonth, "DAYS", function(resp){
		  let days = this.addEmptyDays(firstDayMonth, lastDayMonth);
		  
		  days = days.map(function(item){
			  for(var i=0; i<resp.length; i++){
				  let date = new Date(resp[i].fd);
				  if(item.day == date.getDate()){
					  item.y += resp[i].rv;
				  }
			  }

			  return item;
		  });

		  this.setState({data: days, selectedIndex: 1});
	  }.bind(this));
	  
  }
  
  
  loadHours(item){
	  
	  let datum = item.datum;
	  let day = new Date(datum.year, datum.month, datum.day);
	  
	  
	  this.load(day, day, "HOURS", function(resp){
		  let hours = this.addEmptyHours();
		  var timeZone = this.state.timeZone;
		  
		  hours = hours.map(function(item){
			  for(var i=0; i<resp.length; i++){
			  	  let d = new Date(resp[i].rd);
				  let hour = moment.tz(d, timeZone).format("HH");
				  hour = parseInt(hour);
				  if(item.hour == hour){
					  item.y += resp[i].rv;
				  }
			  }
			  return item;
		  });
		  
		  this.setState({data: hours, selectedIndex: 2});
	  }.bind(this));
	  
  }
  
  
  addEmptyDays(from, to){
	  let days = [];
	  
	  for(var i=0; i<to.getDate(); i++){
		  let day = new Date(to.getFullYear(), to.getMonth(), i+1);
		  days.push({
			  y: 0,
			  x: moment.tz(day, this.state.timeZone).format('DD MMM'),
			  day: i+1,
			  month: to.getMonth(),
			  year: to.getFullYear()
		  })
	  }
	  return days;
  }
  
  //This gonna add months from to date, expected "Y-M-D"
  addEmptyMonths(dates, from, to){

	  if(!dates)dates = [];

	  var start = from.split('-');
	  var end = to.split('-');
	  var startYear = parseInt(start[0]);
	  var endYear = parseInt(end[0]);

	  for(var i = startYear; i <= endYear; i++) {
		  var endMonth = i != endYear ? 11 : parseInt(end[1]) - 1;
		  var startMon = i === startYear ? parseInt(start[1])-1 : 0;
		  for(var j = startMon; j <= endMonth; j = j > 12 ? j % 12 || 11 : j+1) {
			  var month = j+1;
			  var displayMonth = month < 10 ? '0'+month : month;
			  var textMont = moment.tz(new Date([i, displayMonth, '01'].join("-")), this.state.timeZone).format('MMM YY');
			  dates.push({
				  y: 0,
				  x: textMont,
				  year: i,
				  month: month
			  });
		  }
	  }
	  return dates;
  }

  
  addEmptyHours(){
	  let hours = [];
	  
	  for(var i=0; i<24; i++){
		  let hour = i<10 ? "0"+i : i;
		  hours.push({
			  y: 0,
			  x: hour + ":00",
			  hour: i
		  })
	  }
	  return hours;
  }
  
  onChangeButton(index, button){
	  
	  if(this.state.selectedIndex == index)return;
	  
	  if(index == 0){
		  this.loadMonths();
	  }else if(index == 1 && this.state.storedDays){
		  this.loadDays();
	  }else{
		  index = 0;
	  }
	  
	  this.setState({selectedIndex: index});
  }

  onPressbar(event, data){
	  let newIndex = this.state.selectedIndex + 1;
	  this.setState({selectedIndex: newIndex});
	  if(newIndex == 1){
		  this.state.storedDays = data;
		  this.loadDays(data);
	  }else if(newIndex==2){
		  this.loadHours(data);
	  }
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
        <SubMenu title={I18n.t("CONSUMPTIONS_CURVE")} {...this.props} />

        <ConsumptionTabs {...this.props}/>
        
        <PopupDialog dismiss={this.state.dismiss} refModal={this.state.messageAlert} />
        
        <Container style={{flexDirection: "column"}}>
        	<View style={{flexDirection: "row", height: 40}}>

	        	<View style={{flex: 1}}>
	        		<TouchableOpacity onPress={this.onClickDateFrom.bind(this)} style={{flex: 1, justifyContent: "center", flexDirection: "row", borderWidth: 1, borderColor: "grey", margin: 5}}>
						<Icon name="calendar" style={{color: platformStyle.brandPrimary}} />
	        			<Text style={{color: platformStyle.brandPrimary, fontSize: 20 }}> {this.state.dateFrom}</Text>
	        		</TouchableOpacity>
	        	</View>
	        	
	        	<View style={{flex: 1}}>	        	
	        		<TouchableOpacity onPress={this.onClickDateTo.bind(this)} style={{flex: 1, justifyContent: "center", flexDirection: "row", borderWidth: 1, borderColor: "grey", margin: 5}}>
						<Icon name="calendar" style={{color: platformStyle.brandPrimary }} />
	        			<Text style={{color: platformStyle.brandPrimary, fontSize: 20 }}> {this.state.dateTo}</Text>
	        		</TouchableOpacity>
	        	</View>
	        	
        	</View>
        	<View style={{flexDirection: "column", height: 40}}>
	        	<ButtonGroup
		            onPress={this.onChangeButton.bind(this)}
		            selectedIndex={this.state.selectedIndex}
		            buttons={[I18n.t('MONTHS'), I18n.t('DAYS')]}
	        	/>
	    	</View>
        	<View style={{flex: 1}}>
        	
        		<ScrollChart 
        			data={this.state.data}
        			scrollToEnd={true}
        			onPress={this.onPressbar.bind(this)}
        		/>
        	
        	</View>
        </Container>
        

        <Spinner visible={this.state.spinnerVisible} textContent={I18n.t('Loading')}
                 overlayColor={`rgba(0, 0, 0, 0.60)`}
                 textStyle={{ color: '#FFF' }}/>
        <DetailTabs {...this.props} />
      </Container>
    );

  }
}

  
const ConsumptionCurveForm = reduxForm({
  form: "ConsumptionCurveForm",
  enableReinitialize: true,
})(ConsumptionCurve);

function bindAction( dispatch ) {
  return {
    loadDataFormConsumption: ( formData ) => dispatch(loadDataFormConsumption(formData)),
  };
}

const mapStateToProps = state => {
  return {
    initialValues: state.generalReducer.formDataConsumption
  }
};

export default connect(mapStateToProps, bindAction)(ConsumptionCurveForm);

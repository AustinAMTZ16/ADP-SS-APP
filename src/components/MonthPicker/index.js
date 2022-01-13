import React, {Component} from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Icon } from "native-base";
import I18n from 'react-native-i18n';
import moment from 'moment';

import styles from "./styles";
import {platformStyle} from "../../theme";


const defaultMinYear = 2010;
const defaultMaxYear = 2030;

export default class MonthPicker extends Component {
	
	
	constructor( props ) {
		super(props);
		let {selectedDate, minYear, maxYear} = this.props;
		
		if(!selectedDate){
			selectedDate = moment(new Date());
		}else{
			if(Number.isInteger(selectedDate)){
				selectedDate = moment(selectedDate);
			}
		}
				
		if(!minYear){
			minYear = defaultMinYear;
		}
		
		if(!maxYear){
			maxYear = defaultMaxYear;
		}
		
		if(maxYear <= minYear){
			minYear = defaultMinYear;		
			maxYear = defaultMaxYear;
		}
		
		this.state = {	
			selectedMonth: parseInt(selectedDate.format("M")),
			selectedYear: parseInt(selectedDate.format("YYYY")),
			minYear,
			maxYear
		};
				
	}
	
	onPressAccept(month, year){
		let {onAccept} = this.props;
		if(onAccept){
			onAccept(month, year);
		}
	}
	
	onPressCancel(){
		let {onCancel} = this.props;
		if(onCancel){
			onCancel();
		}
	}

	onPressUpMonth(){
		let selectedMonth = this.state.selectedMonth;
		if(selectedMonth < 12){
			this.setState({selectedMonth: selectedMonth+1})
		}
	}
	
	onPressDownMonth(){
		let selectedMonth = this.state.selectedMonth;
		if(selectedMonth > 1){
			this.setState({selectedMonth: selectedMonth-1})
		}
	}
	
	onPressUpYear(){
		let selectedYear = this.state.selectedYear;
		if((selectedYear + 1) <= this.state.maxYear){
			this.setState({selectedYear: selectedYear+1})
		}
	}

	onPressDownYear(){
		let selectedYear = this.state.selectedYear;
		if((selectedYear - 1) >= this.state.minYear){
			this.setState({selectedYear: selectedYear-1})
		}
	}
	
	
	componentDidMount() {
	}
	
	render(){

		
		let month = moment().month(this.state.selectedMonth -1).format("MMMM");
		let selectedDate = moment().month(this.state.selectedMonth -1).year(this.state.selectedYear).format("MM/YYYY");
		
		return(
			<View style={styles.row}>
				<View style={{flex: 1}}>
					
					<View style={{backgroundColor: "#E6E3E2", padding: 10, margin: 10, alignItems: "center"}}>
						<Text style={{fontSize: 20, color: platformStyle.brandPrimary}}>{selectedDate}</Text>
					</View>
					<View style={{margin: 10, marginTop: 5, ...styles.row}}>
					
						<View style={{flex:1}}>
							
							<View style={{alignItems: "center"}}>
								<TouchableOpacity onPress={this.onPressUpMonth.bind(this)}>
									<Icon name={"ios-arrow-up"} style={{color: platformStyle.brandPrimary }} />
								</TouchableOpacity>
							</View>
							
							<View style={styles.dateBox}>
								<Text style={{color: "black", fontSize: 20 }}>{month.charAt(0).toUpperCase() + month.slice(1)}</Text>
							</View>
							
							<View style={{alignItems: "center"}}>
								<TouchableOpacity onPress={this.onPressDownMonth.bind(this)}>
									<Icon name={"ios-arrow-down"} style={{color: platformStyle.brandPrimary }} />
								</TouchableOpacity>
							</View>
							
						</View>
						<View style={{flex:1, marginLeft: 10}}>
							<View style={{alignItems: "center"}}>
								<TouchableOpacity onPress={this.onPressUpYear.bind(this)}>
									<Icon name={"ios-arrow-up"} style={{color: platformStyle.brandPrimary }} />
								</TouchableOpacity>
							</View>
							
							<View style={styles.dateBox}>
								<Text style={{color: "black", fontSize: 20 }}>{this.state.selectedYear}</Text>
							</View>
							
							<View style={{alignItems: "center"}}>
								<TouchableOpacity onPress={this.onPressDownYear.bind(this)}>
									<Icon name={"ios-arrow-down"} style={{color: platformStyle.brandPrimary }} />
								</TouchableOpacity>
							</View>
						
						</View>
					
					</View>
	
					<View style={{margin: 10, marginTop: 5, flexDirection: "row"}}>
					
						<View style={{flex: 1}}>
							<TouchableOpacity 
								style={{backgroundColor: platformStyle.brandPrimary, ...styles.button}} 
								onPress={this.onPressAccept.bind(this, this.state.selectedMonth, this.state.selectedYear)}>
								<Text style={{color: "#FFFF", fontSize: 20}}>{I18n.t("accept")}</Text>
							</TouchableOpacity>
						</View>
						
						<View style={{flex: 1, marginLeft: 10}}>
							<TouchableOpacity 
								style={{backgroundColor: "#CBCBCB", ...styles.button}} 
								onPress={this.onPressCancel.bind(this)}>
								<Text style={{color: platformStyle.brandPrimary, fontSize: 20}}>{I18n.t("cancel")}</Text>
							</TouchableOpacity>
						</View>
						
					</View>
				</View>
			</View>
		);
	}
}
import React, {} from 'react';
import {StyleSheet} from 'react-native';
import repo from '../../services/database/repository'
import {
	Text
} from "native-base";
import { Platform } from "react-native";


if(Platform.OS === 'android') { // only android needs polyfill
	  require('intl'); // import intl object
	  require('intl/locale-data/jsonp/es'); 
	  require('intl/locale-data/jsonp/en'); 
}

const getCurrencieName = function(){
	let cur = getCurrencie();
	if(cur){
		return cur.currencyName;
	}
	return null;
}


const getCurrencie = function(isoCodeParam = ""){
	let currencies = repo.configuration.getField("currencies");
	let isoCode = null;
	if(isoCodeParam==""){
		isoCode = repo.configuration.getField("isoCode");
	}else{
		isoCode = isoCodeParam;
	}
	if(currencies)currencies = JSON.parse(currencies);
	
	for(let i=0;i<currencies.length;i++){
		if(currencies[i].isoCode === isoCode){
			return currencies[i];
		}
	}
	return null;
}

const formatValue = function(value, withSymbol = true, decimals=true,isoCodeParam=""){
	// let currencie = getCurrencie(isoCodeParam);
	let currencie = null;
	let decimalPrecision = 2; //Default
	let isoCode = "USD";//Default
	let lang = 'en';
	if(currencie){
		decimalPrecision = currencie.collDec;
		isoCode = currencie.isoCode;
	}
	let isCurrency = { currency: isoCode, style: 'currency' };
	if(!withSymbol)isCurrency = null;
	if(!decimals)decimalPrecision=0;
	
	value = new Intl.NumberFormat(lang, { minimumFractionDigits: decimalPrecision, ...isCurrency }).format(value)
	
	return value;
}


export function CurrencyText( { value, styles, options, ...props } ) {
	if(options && options.isoCode){
		value = formatValue(value,true,true,options.isoCode);
	}else{
		value = formatValue(value);
	}

	let children = props.children;
	
	if(!options || !options.textAlign){
		if(!options)options = {};
		options.textAlign = "right";//Default
	}
	
	//The value is on the children string?
	let valueOnString = false;
	if(children && children.search("{value}") > 0){
		valueOnString = true;
		children = children.replace("{value}", value);
	}

	return (
			<Text style={{...styles}} {...props}>
				{options.textAlign == "left" ? children : ""} {valueOnString ? "":value} {options.textAlign == "right" ? children : "" }
			</Text>
	);
}
export {getCurrencie, getCurrencieName, formatValue};


const styles = StyleSheet.create( {
	image: {
		flex: 1
	}
} );
import I18n from 'react-native-i18n';
import _ from 'lodash';
import moment from 'moment-timezone';
import repo from '../services/database/repository'

const phoneNumber = ( val ) => !val || /^\d{9,10}$/.test(val) || /^\+\d{1,3}\s\d{9,10}$/.test(val)? null : I18n.t('InvalidPhone');

const email = ( val ) => val && /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(val) ? null : I18n.t('INVALID_EMAIL');

const equalTo = ( fieldToValue, fieldToLabel ) => (value, allValues) => value === allValues[fieldToValue] ? undefined : `This field should be equal to ${fieldToLabel}`;

const minLength = min => value =>
  value && value.length < min ? `Must be ${min} characters or more` : undefined;
const maxLength = max => value =>
  value && value.length > max ? `Must be ${max} characters or less` : undefined;

const numeric = value =>
  value && /^[0-9]+$/i.test(value)
    ? undefined
    : I18n.t('OnlyNumericValues');

const required = ( val, formValues, props ) => {
	if(val && (_.isBoolean(val) || val.toString().length))
		return null;
	else 
		return I18n.t('required_field');
};

const amount = ( value ) => {
	let input = value.replace('.','');	
	input = input.replace(',','.');
	if(input && ((input - 0) == input && (''+input).trim().length > 0)){		
		return null;
	}else{		
		return I18n.t('AMOUNT_INVALID');
	}
};

const passwordValidation = ( val ) => val.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{6,}$/) ? null
  : 'Password should contain at least one number, one lowercase character and one uppercase character.';

const validUrl = ( val ) => val ? val.match(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/) ? null
  : 'This is not a valid url' : null;

const validZip = ( val ) => val && /^\d{4,5}(?:-\d{4})?$/.test(val) ? null : 'This is not a valid zip';

const alphaNumeric = value =>
  value && /[^a-zA-Z0-9 ]/i.test(value)
    ? "Only alphanumeric characters"
    : undefined;

const phone = (val) => {
	// let defaultRegexp = /^254[0-9]{10}$/;
	// let customReg = repo.configuration.getField("phoneMask");
	// console.log(customReg)
	// if(customReg){
	// 	customReg = JSON.parse(customReg);
	// 	try{
	// 		defaultRegexp = new RegExp(customReg[0].mask);
	// 	}catch(e){}
	// }
	// console.log(defaultRegexp, val)
	return val && ( /^\d{10}$/.test(val) || /^\+\d{1,3}\s\d{10}$/.test(val) ) ? null : I18n.t('InvalidPhone');
}


//Generate Date object with string or integer, expected_
// ES: DD/MM/YYYY
// EN: MM/DD/YYYY
const generateDate = (date) => {
	if(Number.isInteger(date)){
		return new Date(date);
	}else{
		let parts = date.indexOf("-") >= 0 ? date.split('-') : date.split('/');
		let lang = repo.configuration.getField("language");console.log("generateDate", lang)
		let year = parts[2];
		let month = lang == "es" ? parts[1] : parts[0];
		month--;
		let day = lang == "es" ? parts[0] : parts[1];
				//Making a more readable format
				//let format = lang == "es" ? [parts[2], parts[1] - 1, parts[0]] : [parts[2], parts[0] - 1, parts[1]];
		return new Date(year, month, day);
	}
}

//Only allow dates from tomorrow
const minTomorrow = ( val, formValues, props ) => {

	if(val){

	    let tomorrow = new Date();
	    tomorrow.setDate(tomorrow.getDate() + 1);     
	    tomorrow.setHours(0,0,0,0);
	    
	    val = generateDate(val);
	            
		if(val.getTime() < tomorrow.getTime()){
			return I18n.t('MIN_TOMORROW')
		}
		
	}
	return null;
}

///Compare field with disconnectionDate and validate max 30 days after
const maxDisconection30Days = ( val, formValues, props ) => {
	
	if(!formValues.disconnectionDate || !val)return null;

	let discconectionDate = generateDate(formValues.disconnectionDate)
	val = generateDate(val);
	
	//first check val is mayor than discconectionDate
	if(val.getTime() <= discconectionDate.getTime()){
		return I18n.t('RECONNECT_BIGGER_THAN_DISCONNECT');
	}
	
    let max = moment(discconectionDate).add(30, "days");
    val = moment(val);
    
    if(val.isAfter(max)){
		return I18n.t('RECONNECTION_MAX');
    }
    
	return null;
}


const validateDocNumber = (val, formValues, props) => {
	let docTypes = repo.configuration.getField("documType");
	docTypes = JSON.parse(docTypes);
	let type = _.find(docTypes, {codDevelop: formValues.docType});
	if(!type || !type.validationMask)return null;
	
	let validationMask = type.validationMask;
	return val && new RegExp(validationMask).test(val) ? null : 'This is not a valid doc number';
}

//Format dates based on language
const formatLocaleDate = (date) =>{
	let timeZone = repo.configuration.getField("timeZone");
	let language = repo.configuration.getField("language");
	return moment.tz(date, timeZone).format(language == "es" ? 'DD-MM-YYYY' : 'MM-DD-YYYY')
}

const getDateFromLocaleFormat = (dateFormatted) =>{
	let date = null;
	if(repo.configuration.getField("language") == "es"){
		//"DD/MM/YYYY"
		date = new Date(dateFormatted.substring(6,10), parseInt(dateFormatted.substring(3,5))-1, dateFormatted.substring(0,2));
	}else{
		//"MM/DD/YYYY"
		date = new Date(dateFormatted.substring(6,10), dateFormatted.substring(0,2), parseInt(dateFormatted.substring(3,5))-1);
	}
	return date;
}

const maxLength15 = maxLength(15);
const minLength5 = minLength(5);



module.exports = {
  phoneNumber,
  email,
  equalTo,
  numeric,
  amount,
  minLength,
  maxLength,
  required,
  passwordValidation,
  validUrl,
  validZip,
  minLength5,
  maxLength15,
  phone,
  minTomorrow,
  maxDisconection30Days,
  generateDate,
  validateDocNumber,
  getDateFromLocaleFormat,
  formatLocaleDate
};

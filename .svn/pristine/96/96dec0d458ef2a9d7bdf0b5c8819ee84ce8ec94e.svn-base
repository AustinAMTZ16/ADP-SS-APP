import I18n from 'react-native-i18n';
import repo from '../database/repository';
import DeviceInfo from 'react-native-device-info';
import * as availableLanguages from '../../services/i18n/lan';

import moment from 'moment';
import momentTZ from 'moment-timezone';
import 'moment/locale/es';
import Config from 'react-native-config';

I18n.translations.en = require('./lan/en.json');
I18n.translations.es = require('./lan/es.json');

let getDeviceCountry = function(){
	return DeviceInfo.getDeviceLocale().split("-")[1];
}

let defaultLang = Config.DEFAULT_LANG;

//Check if exists the language definition on the momento library
let existsMomentLocale = function(lang){
	let locales = momentTZ.locales();
	for(var i=0;i<locales.length; i++){
		if(locales[i] === lang)
			return true;
	}
	return false;
}

let changeLanguage = function(lang){
	let selectedLang = lang;
	if(!selectedLang){
		let repoLanguage = repo.configuration.getField('language');//only store code like "es", "en"...
		if(repoLanguage){
			selectedLang = repoLanguage + "-" + getDeviceCountry();
		}else{
			selectedLang = "es-MX";
		}
		
	}

	let locale = selectedLang.split("-")[0];
	
	if(!availableLanguages[locale]){
		selectedLang = defaultLang;
	}
	
	locale = selectedLang.split("-")[0];
	repo.configuration.setField('language', locale);

	if(!existsMomentLocale(locale)){
	    momentTZ.defineLocale(locale, moment.localeData()._config);
	}

    moment.locale(locale);
    momentTZ.locale(locale);
	I18n.defaultLocale = selectedLang;
	I18n.locale = selectedLang;
	I18n.missingBehaviour='guess';

	I18n.fallbacks = true;

};


export { getDeviceCountry, changeLanguage };


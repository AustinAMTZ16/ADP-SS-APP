import * as themes from './themes';
import repo from '../services/database/repository';

export let platformStyle = themes["defaultTheme"];
export let variable = platformStyle;
export function setTheme (){

	let tenantId = repo.configuration.getField('tenantId');
	if(tenantId in themes){
		platformStyle = themes[tenantId];
	}else{
		platformStyle = themes["defaultTheme"]
	}
	variable = platformStyle;
}

setTheme();

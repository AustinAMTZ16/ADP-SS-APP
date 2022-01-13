import React, {Component} from "react";
import I18n from 'react-native-i18n';

import YellowTabs from "../../../components/YellowTabs";
import repo from '../../../services/database/repository';

class TabsComponent extends Component {

	render() {

		let additionalData = JSON.parse(repo.configuration.getField('accountAdditionalData'));
		let tabs = [
			{route: 'AccountConsumptionPayment', label: I18n.t( 'CONSUMPTIONS_GRAPH' )},
			{route: 'AccountConsumptionList', label: I18n.t( 'CONSUMPTIONS_LIST' )},
		];

		if(additionalData.indTarificable){
			tabs.push({route: 'ConsumptionCurve', label: I18n.t( 'CONSUMPTIONS_CURVE' )})
		}

		return ( <YellowTabs tabs={tabs} {...this.props}  /> )
	}

}

export default TabsComponent;

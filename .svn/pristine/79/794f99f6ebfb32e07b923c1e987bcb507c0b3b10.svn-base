import React, { Component } from "react";
import { Button, Footer, FooterTab, Text, View} from "native-base";
import I18n from 'react-native-i18n';

import HelperService from "../../../services/HelperService";
import sharedStyles from '../../../shared/styles';
import {platformStyle} from "../../../theme";
import repo from '../../../services/database/repository';

class TabsComponent extends Component {

  render() {
    const { navigation } = this.props;
    const routeName = navigation.state.routeName;
    const AdditionalData = JSON.parse(repo.configuration.getField('accountAdditionalData'));

    const consumption = [];
    if(AdditionalData.indMesurable){
    	consumption[0] = <View key={1} style={{ ...sharedStyles.divider('right'), ...sharedStyles.margin('vertical', 2) }}/>
    	consumption[1] = (
			<Button key={2} buttonFooterTabActive={routeName === 'AccountConsumptionPayment' || routeName === 'AccountConsumptionList' || routeName === 'ConsumptionCurve'}
			        buttonFooterTab={!(routeName === 'AccountConsumptionPayment' || routeName === 'AccountConsumptionList' || routeName === 'ConsumptionCurve')}
			        onPress={() => HelperService.navigateTo(navigation, 'AccountConsumptionPayment', { origin: true })}
			       style={{paddingLeft: 0, paddingRight: 0, backgroundColor: platformStyle.brandPrimary }}>
				 <Text black={routeName === 'AccountConsumptionPayment' || routeName === 'AccountConsumptionList'}>
				   {I18n.t('CONSUMPTIONS').toUpperCase()}
				 </Text>
			</Button>
    	);
    }
    
    if (!this.props.indPrepayment) {
    return (
      <Footer noElevation >
        <FooterTab style={{backgroundColor: platformStyle.brandPrimary}}>
          <Button buttonFooterTabActive={routeName === 'AccountSummaryTelecontrol' || routeName === 'AccountSummaryPayment' || routeName === 'AccountSummaryList'}
                  buttonFooterTab={!(routeName === 'AccountSummaryTelecontrol' || routeName === 'AccountSummaryPayment' || routeName === 'AccountSummaryList')}
                  onPress={() => HelperService.navigateTo(navigation, 'AccountSummaryPayment')}
                  style={{paddingLeft: 0, paddingRight: 0, backgroundColor: platformStyle.brandPrimary}}>
            <Text black={routeName === 'AccountSummaryPayment' || routeName === 'AccountSummaryList'}>
              {I18n.t('BILLS').toUpperCase()}
            </Text>
          </Button>

          {consumption}
          
          <View style={{
            ...sharedStyles.divider('right'),
            ...sharedStyles.margin('vertical', 2)
          }}/>

            <Button buttonFooterTabActive={routeName === 'AccountHistory'}
                    buttonFooterTab={!(routeName === 'AccountHistory')}
                    onPress={() => HelperService.navigateTo(navigation, 'AccountHistory')}
                    style={{paddingLeft: 0, paddingRight: 0, backgroundColor: platformStyle.brandPrimary}}>
              <Text black={routeName === 'AccountHistory'}>
                {I18n.t('TRANSACTIONS').toUpperCase()}
              </Text>
            </Button>
        </FooterTab>
      </Footer>
    )
    } else {
      return (<View/>)
    }
  }
}

export default TabsComponent;

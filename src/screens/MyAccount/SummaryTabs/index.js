import React, { Component } from "react";
import I18n from 'react-native-i18n';
import {getCurrencieName} from '../../../components/CurrencyText';

import YellowTabs from "../../../components/YellowTabs";

class TabsComponent extends Component {

  render() {
    if( this.props.isPrepWithTelecontrol )
      return (
          <YellowTabs tabs={[
          {
            route: 'AccountSummaryTelecontrol',
            label: I18n.t('BALANCE CONTROL')
          },
          {
            route: 'AccountSummaryPayment',
            label: I18n.t('BILL_GRAPH')
          },
          { route: 'AccountSummaryList',
            label: I18n.t('BILL_LIST')
          }
          ]} {...this.props}
          />
      );
    else if( this.props.indPrepayment )
      return (
        <YellowTabs tabs={[
          {
            route: 'AccountSummaryPayment',
            label: I18n.t('AMMOUNTS') + ' ('+getCurrencieName()+')'
          },
          { route: 'AccountSummaryUnits', label: I18n.t('UNITS') + ' (kWh)' },
          { route: 'AccountSummaryList', label: I18n.t('TOP_UP_LIST') },
        ]} {...this.props}
        />);
    else
      return (
        <YellowTabs tabs={[
          {
            route: 'AccountSummaryPayment',
            label: I18n.t('BILL_GRAPH')
          },
          { route: 'AccountSummaryList', label: I18n.t('BILL_LIST') },
        ]} {...this.props}
        />
      )
  }
}

export default TabsComponent;

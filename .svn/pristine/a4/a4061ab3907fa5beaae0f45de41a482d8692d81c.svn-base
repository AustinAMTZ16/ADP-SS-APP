import React, {Component} from "react";
import I18n from 'react-native-i18n';

import YellowTabs from "../../../components/YellowTabs";

class TabsComponent extends Component {

  render() {
    return (
      <YellowTabs tabs={[
        {route: 'HolderRequestCorrespondence', label: I18n.t( 'Correspondence' ), disabled: true},
        {route: 'HolderRequestPayment', label: I18n.t( 'Payment' ), disabled: true},
        {route: 'HolderRequestDocumentation', label: I18n.t( 'Documentation' ), disabled: true},
        ]} {...this.props}
      />
    )
  }
}

export default TabsComponent;

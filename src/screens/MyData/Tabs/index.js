import React, {Component} from "react";
import I18n from 'react-native-i18n';

import YellowTabs from "../../../components/YellowTabs";

class TabsComponent extends Component {

  render() {
    return (
      <YellowTabs tabs={[
        {route: 'MyDataPersonalInfo', label: I18n.t( 'Personal' )},
        {route: 'MyDataContactInfo', label: I18n.t( 'CONTACT' )},
        {route: 'MyDataPhysicalAddress', label: I18n.t( 'Address' )},
        ]} {...this.props}
      />
    )
  }
}

export default TabsComponent;

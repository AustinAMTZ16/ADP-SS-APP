import React from 'react';
import {StackNavigator} from 'react-navigation'

import HelperService from "../../services/HelperService";
import PersonalInfo from "./PersonalInfo";
import ContactInfo from "./ContactInfo";
import PhysicalAddress from "./PhysicalAddress";
import TermsConditions from "../TermsConditions"

const MyDataStackNavigation = StackNavigator(
  {
    MyDataPersonalInfo: { screen: PersonalInfo },
    MyDataContactInfo: { screen: ContactInfo },
    MyDataPhysicalAddress: { screen: PhysicalAddress },
    TermsConditions: { screen: TermsConditions },
  },
  {
    index: 0,
    initialRouteName: 'MyDataPersonalInfo',
    headerMode: "none",
    mode: 'card'
  }
);

MyDataStackNavigation.router = HelperService.replaceStack( MyDataStackNavigation );

export default MyDataStackNavigation

import React from 'react';
import {StackNavigator} from 'react-navigation'

import HelperService from "../../services/HelperService";
import List from "./List";
import Report from "./Report";
import ReportCoordinates from "./ReportCoordinates";
import Accounts from "../ComplaintsSuggestions/Accounts";

const OutagesStackNavigation = StackNavigator(
  {
    OutagesList: { screen: List },
    OutagesReport: { screen: Report },
    OutagesReportCoordinates: { screen: ReportCoordinates },
    Accounts: { screen: Accounts },
  },
  {
    index: 0,
    initialRouteName: 'OutagesList',
    headerMode: "none",
    mode: 'card'
  }
);

OutagesStackNavigation.router = HelperService.replaceStack( OutagesStackNavigation );

export default OutagesStackNavigation

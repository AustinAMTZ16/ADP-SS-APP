import React from 'react';
import {StackNavigator} from 'react-navigation'

import HolderRequestList from "./List";
import HolderRequestSearch from "./Search";
import Correspondence from "./Correspondence";
import Payment from "./Payment";
import Documentation from "./Documentation";
import Resumen from "./Resumen";
import HelperService from "../../services/HelperService";

const HolderRequestsStackNavigation = StackNavigator(
  {
    HolderRequestList: { screen: HolderRequestList },
    HolderRequestSearch: { screen: HolderRequestSearch },
    HolderRequestCorrespondence: { screen: Correspondence },
    HolderRequestPayment: { screen: Payment },
    HolderRequestDocumentation: { screen: Documentation },
    HolderRequestResumen: { screen: Resumen },
  },
  {
    index: 0,
    initialRouteName: 'HolderRequestList',
    headerMode: "none",
    mode: 'card'
  }
);

HolderRequestsStackNavigation.router = HelperService.replaceStack( HolderRequestsStackNavigation );

export default HolderRequestsStackNavigation

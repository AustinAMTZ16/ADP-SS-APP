import React from 'react';
import {StackNavigator} from 'react-navigation'

import ListPersonal from "./ListPersonal";
import ListCorporate from "./ListCorporate";
import CorporateAccounts from "./CorporateAccounts";
import SummaryLetter from "./SummaryLetter";
import SummaryPayment from "./SummaryPayment";
import SummaryTelecontrol from "./SummaryTelecontrol";
import SummaryUnits from "./SummaryUnits";
import SummaryList from "./SummaryList";
import ConsumptionList from "./ConsumptionList";
import ConsumptionPayment from "./ConsumptionPayment";
import ConsumptionCurve from "./ConsumptionCurve";
import History from "./History";
import RegisterSelfReading from "./RegisterSelfReading";
import SelfReading from "./SelfReading";
import RequestEBilling from "./RequestEBilling";
import AddReading from "./AddReading";
import HelperService from "../../services/HelperService";
import ViewPDF from "../ViewPDF";
import Payment from "./Payment";
import TemporaryDisconnectionList from "./TemporaryDisconnection/List";
import NewDisconnection from "./TemporaryDisconnection/NewDisconnection";
import TermsConditions from "../TermsConditions";


import PayBills from "./Payments/PayBills";
import TopUp from "./Payments/TopUp";
import PaymentScreen from "./Payments/PaymentScreen";

import Contact from "../Contact";
import Tips from "../Tips";
import About from "../About";


const AccountsStackNavigation = StackNavigator(
  {
    AccountsListCorporate: { screen: ListCorporate },
    AccountCorporateAccounts: { screen: CorporateAccounts },
    AccountSummaryLetter: { screen: SummaryLetter },
    AccountsListPersonal: { screen: ListPersonal },
    AccountConsumptionList: { screen: ConsumptionList },
    AccountConsumptionPayment: { screen: ConsumptionPayment },
    AccountHistory: { screen: History },
    AccountSummaryUnits: { screen: SummaryUnits },
    AccountSummaryPayment: { screen: SummaryPayment },
    AccountSummaryTelecontrol: { screen: SummaryTelecontrol },
    AccountSummaryList: { screen: SummaryList },
    AccountSelfReading: { screen: SelfReading },
    AccountRegisterSelfReading: { screen: RegisterSelfReading },
    AccountRequestEBilling: { screen: RequestEBilling },
    TemporaryDisconnectionList: { screen: TemporaryDisconnectionList },
    NewDisconnection: {screen: NewDisconnection},
    ViewPDF: { screen: ViewPDF },
    AccountPayment: { screen: Payment },
    AddReading: { screen:AddReading },
    About: { screen: About },
    Contact: { screen: Contact },
    Tips: { screen: Tips },
    PayBills: { screen: PayBills },
    TopUp: { screen: TopUp },
    PaymentScreen: { screen: PaymentScreen },
    TermsConditions: { screen: TermsConditions },
    ConsumptionCurve: { screen: ConsumptionCurve }
  },
  {
    index: 0,
    initialRouteName: 'AccountsListPersonal',
    headerMode: "none",
    mode: 'card'
  }
);

AccountsStackNavigation.router = HelperService.replaceStack( AccountsStackNavigation );

export default AccountsStackNavigation

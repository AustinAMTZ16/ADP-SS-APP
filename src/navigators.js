import React from 'react';
import { createDrawerNavigator, createStackNavigator } from 'react-navigation'
import {
	StyleSheet,
	Text,
	View,
	Animated,
	Easing
} from 'react-native';

import InitialPage from "./screens/Initial";
import Login from "./screens/Login";
import ForgotPassword from "./screens/ForgotPassword";
import MyAccount from "./screens/MyAccount";
import MyData from "./screens/MyData";
import HolderRequests from "./screens/HolderRequests";
import ComplaintsSuggestions from "./screens/ComplaintsSuggestions";
import SideBar from "./screens/Sidebar/";
import Setting from "./screens/Setting";
import About from "./screens/About";
import Register from "./screens/Register";
import TermsConditions from "./screens/TermsConditions";
import ViewPDF from "./screens/ViewPDF";
import OtherAccounts from "./screens/OtherAccounts";
import ElectronicBill from "./screens/ElectronicBill/List";
import AnnualFolioScreen from "./screens/MyAccount/AnnualFolio"
import RequestElectronicBill from "./screens/ElectronicBill/Request";
import LinkContractScreen from "./screens/LinkContract";
import AnnualPaymentScreen from "./screens/Program/AnnualPayment";
import DebtCondonationScreen from "./screens/Program/DebtCondonation";
import PeriodExtension from "./screens/Program/PeriodExtension";
import NoDebtProofScreen from "./screens/Program/NoDebtProof";
import AdhereProgramScreen from "./screens/Program/AdhereProgram";
import PaymentScreen from "./screens/MyAccount/Payments/PaymentScreen";
import AssistantScreen from "./screens/Assistant/Assistant";
import AvailableProceduresScreen from "./screens/Assistant/AvailableProcedures";
import HistoricProceduresScreen from "./screens/Assistant/HistoricProcedures";
import AssistantScheduleScreen from "./screens/Assistant/AssistantSchedule";
import RequestEBilling from "./screens/MyAccount/RequestEBilling";

//public
import PublicHome from "./screens/Public/Home";
import PublicComplaintsSuggestions from "./screens/Public/ComplaintsSuggestions";
import Outages from "./screens/Outages";
import OutagesReport from "./screens/Outages/Report";
import Contact from "./screens/Contact";
import Signature from "./screens/Signature";
import Tips from "./screens/Tips";
import NewApplications from "./screens/NewApplications";
import ServiceRequests from "./screens/ServiceRequests";
import Walkthrough from "./screens/Walkthrough";
import ServerSelectionPage from "./screens/ServerSelection";
import ChangePassword from "./screens/ChangePassword";
import ChangeLanguage from "./screens/ChangeLanguage";
import Help from "./screens/Help";
import Webmail from "./screens/Messages/Webmail";
import AlertList from "./screens/Messages/AlertList";
import AlertDetail from "./screens/Messages/AlertDetail";
import ViewHTML from "./screens/ViewHTML";
import ValidateDocuments from "./screens/ValidateDocuments";
import QRCodeScanner from "./screens/ValidateDocuments/scanner";

export const InitialView = InitialPage;

export const LoginStackNavigatorLogin = createStackNavigator(
		{
			Login: { screen: Login },
			Register: { screen: Register },
			TermsConditions: { screen: TermsConditions },
			ForgotPassword: { screen: ForgotPassword },
			About: { screen: About },
			Contact: { screen: Contact },
			Signature: { screen: Signature },
			Tips: { screen: Tips },
      Help: { screen: Help },
      ValidateDocuments: { screen: ValidateDocuments },
      QRCodeScanner: {  screen: QRCodeScanner }
		},
		{
			index: 0,
			initialRouteName: "Login",
			headerMode: "none",
			mode: 'card',
		}
);

export const WalkthroughStackNavigatorLogin = createStackNavigator(
		{
			Walkthrough: { screen: Walkthrough }
		},
		{
			index: 0,
			initialRouteName: "Walkthrough",
			headerMode: "none",
			mode: 'card',
		}
);

export const WalkthroughStackServerSelection = createStackNavigator(
		{
			ServerSelection: { screen: ServerSelectionPage },
			Walkthrough: { screen: Walkthrough }
		},
		{
			index: 0,
			initialRouteName: "ServerSelection",
			headerMode: "none",
			mode: 'card',
		}
);


export const DrawerPrivate = createDrawerNavigator(
		{
			MyAccount: { screen: MyAccount },
			LinkContractScreen:{ screen: LinkContractScreen },
			MyData: { screen: MyData },
			HolderRequests: HolderRequests,
			ComplaintsSuggestions: ComplaintsSuggestions,			
			Setting: { screen: Setting },
			ServiceRequests: ServiceRequests,
			AnnualFolioScreen: AnnualFolioScreen,

			// Assistant: AssistantScreen,
			// AvailableProcedures: AvailableProceduresScreen,
			// HistoricProcedures: HistoricProceduresScreen,

			AssistantScreen: createStackNavigator(
				{
					Assistant: { screen: AssistantScreen },
					AvailableProcedures: { screen: AvailableProceduresScreen },
					HistoricProcedures: { screen: HistoricProceduresScreen },
					ViewHTML: { screen: ViewHTML },
					AccountRequestEBilling: { screen: RequestEBilling },
					AssistantScheduleScreen: { screen: AssistantScheduleScreen },
				},
				{
					index: 0,
					initialRouteName: 'Assistant',
					headerMode: "none",
					mode: 'card'
				}
			),

			// AnnualPaymentScreen: { screen: AnnualPaymentScreen },
			// PaymentScreen: { screen: PaymentScreen },
			PeriodExtension: PeriodExtension,
			AdhereProgramScreen:AdhereProgramScreen,
			AnnualPaymentScreenStack: createStackNavigator(
				{
					AnnualPaymentScreen: { screen: AnnualPaymentScreen },
					PaymentScreen: { screen: PaymentScreen }
				},
				{
					index: 0,
					initialRouteName: 'AnnualPaymentScreen',
					headerMode: "none",
					mode: 'card'
				}
			),

			DebtCondonationScreen: createStackNavigator(
				{
					DebtCondonationScreen: { screen: DebtCondonationScreen },
					PaymentScreen: { screen: PaymentScreen }
				},
				{
					index: 0,
					initialRouteName: 'DebtCondonationScreen',
					headerMode: "none",
					mode: 'card'
				}
			),

			NoDebtProofScreen: createStackNavigator(
				{
					NoDebtProofScreen: { screen: NoDebtProofScreen },
					PaymentScreen: { screen: PaymentScreen }
				},
				{
					index: 0,
					initialRouteName: 'NoDebtProofScreen',
					headerMode: "none",
					mode: 'card'
				}
			),

			
			ElectronicBill: createStackNavigator(
				{
					ElectronicBill: { screen: ElectronicBill },
					RequestElectronicBill: { screen: RequestElectronicBill },
					ViewPDF: { screen: ViewPDF }
				},
				{
					index: 0,
					initialRouteName: 'ElectronicBill',
					headerMode: "none",
					mode: 'card'
				}
			),
			NewApplications: NewApplications,
			Outages: { screen: Outages },
			Webmail: createStackNavigator(
				{
					Webmail: { screen: Webmail },
					ViewPDF: { screen: ViewPDF }
				},
				{
					index: 0,
					initialRouteName: 'Webmail',
					headerMode: "none",
					mode: 'card'
				}
			),
			AlertList: createStackNavigator(
				{
					AlertList: { screen: AlertList },
					Signature: { screen: Signature },
					ViewPDF: { screen: ViewPDF },
					AlertDetail: { screen: AlertDetail }
				},
				{
					index: 0,
					initialRouteName: 'AlertList',
					headerMode: "none",
					mode: 'card'
				}),
			ChangePassword: { screen: ChangePassword },
			ChangeLanguage: { screen: ChangeLanguage },
			Help: { screen: Help },
			OtherAccounts: { screen: OtherAccounts}

			// About: { screen: About },
			// Contact: { screen: Contact },
			// Tips: { screen: Tips },
		},
		{
			backBehavior: 'initialRoute',
			initialRouteName: 'MyAccount',
			contentComponent: props => <SideBar {...props} />,
			drawerPosition: 'right'
		}
);

export const PrivateStackNavigator = createStackNavigator(
		{
			Drawer: { screen: DrawerPrivate },
		},
		{
			index: 0,
			initialRouteName: 'Drawer',
			headerMode: "none",
			mode: 'card'
		}
);

//PUBLIC ZONE
export const PublicStackNavigator = createStackNavigator(
		{
			PublicHome: { screen: PublicHome },			
			ViewPDF: { screen: ViewPDF },
			Outages: { screen: OutagesReport },
			PublicComplaintsSuggestions: createStackNavigator(
					{
						PublicComplaintsSuggestions: { screen: PublicComplaintsSuggestions },
						TermsConditions: { screen: TermsConditions }
					},
					{
						index: 0,
						initialRouteName: 'PublicComplaintsSuggestions',
						headerMode: "none",
						mode: 'card'
					}
			),
			NewApplications: NewApplications
		},
		{
			index: 0,
			initialRouteName: 'PublicHome',
			headerMode: "none",
			mode: 'card'
		}
);

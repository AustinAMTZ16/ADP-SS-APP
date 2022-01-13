import React, {Component} from "react";
import {Image} from 'react-native';
import {Container, Text, View} from "native-base";
import styles from './styles';
import moment from 'moment-timezone';

import Header from '../../../components/Header';
import {getCurrencieName, formatValue} from '../../../components/CurrencyText';
import DetailTabs from '../DetailTabs/';
import SummaryTabs from '../SummaryTabs/';
import I18n from 'react-native-i18n';
import {platformStyle} from "../../../theme";
import SubMenu from '../SubMenu';
import {
    VictoryChart,
    VictoryAxis,
    VictoryBar,
    VictoryLegend,
    VictoryLabel
} from 'victory-native';
import generalService from "../../../services/general/generalService";
import waterfall from "async/waterfall";
import PopupDialog from '../../../components/PopupDialog/';
import Spinner from '../../../components/Spinner';
import repo from '../../../services/database/repository'
import firebaseService from "../../../services/firebase/firebaseService";
import TimerMixin from "react-timer-mixin";
import { formatLocaleDate } from '../../../shared/validations';

class AccountSummaryTelecontrol extends Component {

    /**
     * remainingBalance:117.92
     * simulatedTotalAmount: 12.08
     * fromDate: 1563487200000
     * toDate: 1565474400000
     *
     */

    constructor(props) {
        super(props);

        const {params} = this.props.navigation.state;

        if (params) {
            repo.configuration.setField("isPrepWithTelecontrol", params.codServiceRateType === '240TYSERRA');
        }

        this.state = {
            graphLabel: "",
            data: [],
            spinnerVisible: false,
            indPrepayment: null,
            isPrepWithTelecontrol: repo.configuration.getField("isPrepWithTelecontrol")
        };
    }

    componentDidMount() {
        firebaseService.supervisorAnalytic('BILLGRAPH');
        const {params} = this.props.navigation.state;
               let remBal = repo.configuration.getField('remainingBalance');
        if (remBal=="{}") {
            this.setState({
                spinnerVisible: true
            }, function () {
                repo.configuration.setField('remainingBalance', JSON.stringify({}));
                this.getRemainingBalanceFromBackend();
            }.bind(this));
        } else {
            this.getRemainingBalanceFromDB();
        }
    }

    getRemainingBalanceFromDB(){
        let data = JSON.parse(repo.configuration.getField('remainingBalance'));
        data!=null?this.setData(data):"";
    }

    getRemainingBalanceFromBackend() {
        this.setState({
            spinnerVisible: true
        });
        waterfall([
            (callback) => {
                let idAccount = repo.configuration.getField('idPaymentForm');
                generalService.getRemainingBalance(idAccount, callback);
            }
        ], (err, result) => {
            if (!err) {
                if (result) {
                    repo.configuration.setField('remainingBalance', JSON.stringify(result));
                    this.setData(result);
                } else {
                    this.setState({data: null, spinnerVisible: false});
                }
            } else {
                this.setState({spinnerVisible: false}, function () {
                    TimerMixin.setTimeout(() => {
                        this.setState(err)
                    }, 1000);
                }.bind(this));
            }
        });
    }

    setData(result) {
        let timeZone = repo.configuration.getField("timeZone");
        let fromDate = result.fromDate ? formatLocaleDate(result.fromDate) : '-';
        let toDate = result.toDate ? formatLocaleDate(result.toDate) : '-';

        this.setState({
            spinnerVisible: false,
            data: this.convertData(result),
            graphLabel: fromDate + " to " + toDate
        });
    }

    convertData(result) {
        let data = [];
        let simulated = {x: 1, y: Math.abs(result.simulatedTotalAmount), fill: "#C62828"};
        let remainingBalance = {x: 1, y: Math.abs(result.remainingBalance), fill: "#004B8D"};
        
        //PIEI-47551 Change order. The maximun ammount should be the first element array
        if (simulated.y > remainingBalance.y) {
            data.push(simulated);
            data.push(remainingBalance);
        }else if(simulated.y < remainingBalance.y){
            data.push(remainingBalance);
            data.push(simulated);
        }else{
        	//When values are equals make two bars
        	remainingBalance.x = 2;
            data.push(remainingBalance);
            data.push(simulated);
        }
        
        return data;
    }

    render() {

        return (
            <Container>
                <Header noDrawer {...this.props}
                        iconAction={'ios-home-outline'}/>
                <SubMenu title={I18n.t("ACCOUNT_SUMMARY")} {...this.props} reRender={this.state.reRender}
                         indPrepayment={this.state.indPrepayment}/>
                <PopupDialog
                    refModal={this.state.messageAlert}
                />
                <SummaryTabs {...this.props} indPrepayment={this.state.indPrepayment}
                                             isPrepWithTelecontrol={this.state.isPrepWithTelecontrol}/>

                <Text style={{padding:5}}>{I18n.t("CURRENT PERIOD") + getCurrencieName()}</Text>

                <View style={styles.slide1} pointerEvents="box-only">
                    <VictoryChart domainPadding={{ x: 25 }}>

                        <VictoryBar data={this.state.data} style={{data: { fill: d => d.fill }}}/>

                        <VictoryAxis label={this.state.graphLabel} style={{ tickLabels: { fill: "none" } }} />
                        <VictoryAxis dependentAxis />

                        <VictoryLegend y={0} x={0}
                               orientation="horizontal"
                               gutter={20}
                               style={{ border: { stroke: "none" }, title: {fontSize: 20 } }}
                               data={[
								  { name: I18n.t("REMAINING"), symbol: { fill: "#004B8D" } },
								  { name: I18n.t("USED"), symbol: { fill: "#C62828" } }
							   ]}
                        />
                    </VictoryChart>
                </View>

                <Spinner visible={this.state.spinnerVisible} textContent={I18n.t('Loading')}
                         overlayColor={`rgba(0, 0, 0, 0.60)`}
                         textStyle={{ color: '#FFF' }}/>
                <DetailTabs {...this.props} indPrepayment={this.state.indPrepayment}/>
            </Container>
        );

    }
}

export default AccountSummaryTelecontrol;
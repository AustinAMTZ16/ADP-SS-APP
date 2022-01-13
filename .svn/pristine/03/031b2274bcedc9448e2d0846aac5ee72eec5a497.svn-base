import React, {Component} from "react";
import {TouchableOpacity} from 'react-native';
import {Text, Content, Container, Left, Body, ListItem, Row, View, Icon, Footer, FooterTab, Button} from "native-base";
import {FlatList} from 'react-native';
import I18n from 'react-native-i18n';
import {connect} from 'react-redux';
import TimerMixin from "react-timer-mixin";
import {Field, reduxForm} from "redux-form";
import {NavigationActions} from 'react-navigation';

import {platformStyle} from "../../../theme";
import Header from '../../../components/Header';
import SubHeader from '../../../components/SubHeader';
import sharedStyles from '../../../shared/styles';
import styles from './styles'
import waterfall from "async/waterfall";
import repo from '../../../services/database/repository'
import Spinner from '../../../components/Spinner';
import {createAlert} from '../../../components/ScreenUtils';
import bannerService from "../../../services/general/bannerService";
import PopupDialog from '../../../components/PopupDialog/';
import {required} from '../../../shared/validations';

import FormField from '../../../components/FormField/';

const emptyData = {
    debtBillCycle: "",
    debtOtherCharges: "",
    condonationBillCycle: "",
    condonationOtherCharges: "",
    totalAmount: ""
};

const backAction = NavigationActions.back({
    key: null
});

class DebtCondonationScreen extends Component {

    constructor(props) {
        super(props);

        this.state = {
            data: emptyData,
            spinnerVisible: false
        }
    }

    componentDidMount() {
        let program = repo.configuration.getField('adpProgramData');
        if (program != "") {
            let adpProgram = JSON.parse(program);
            this.program = adpProgram;
        }

        this.loadData();
    }

    submit(values) {
        waterfall([
            (callback) => {
                let req = {
                    "idPaymentForm": repo.configuration.getField('idPaymentFormSelected'),
                    "programType": this.program.type
                };
                bannerService.getDebtBillSS(req, callback);
            }
        ], (err, result) => {
            if (!err) {
                if(this.state.data.totalAmount == 0) {
                    this.valDebtOffsetCalc();
                } else if (result && result.data && result.data.billList.length) {
                    let billList = result.data.billList.map(function(item){
                        return {idBill: item.idBill};
                    });
                    this.props.navigation.navigate('PaymentScreen', {
                        indPrepayment: false,
                        amount: this.state.data.totalAmount,
                        listBills: [{billList}],
                        idPaymentForm: repo.configuration.getField('idPaymentFormSelected'),
                        paymentDone: () => {
                            this.valDebtOffsetCalc();
                        }
                    });
                } else {
                    TimerMixin.setTimeout(() => {
                        this.setState({
                            messageAlert: createAlert(I18n.t("INFO"), I18n.t("NO_DATA"))
                        });
                    }, 500);
                }
            } else {
                TimerMixin.setTimeout(() => {
                    this.setState(err)
                }, 1000);
            }
        });
    }

    addProgramSubscriber() {
        waterfall([
            (callback) => {
                let req = {
                    "idPaymentForm": repo.configuration.getField('idPaymentFormSelected'),
                    "programType": this.program.type
                };
                bannerService.addProgramSubscriber(req, callback);
            }
        ], (err, result) => {
            if (!err) {
                let options =  {
                    1: {
                        key: 'button1',
                        text: `${I18n.t('accept')}`,
                        action: () => {
                            TimerMixin.setTimeout(() => {
                                this.props.navigation.dispatch(backAction);
                            }, 500);
                        },
                        align: ''
                    }
                };
            TimerMixin.setTimeout(() => {
                this.setState({messageAlert: createAlert(I18n.t("PROGRAM_INFO_ADP"), I18n.t("PROGRAM_SUSCRIBE_DONE").replace("{program}",this.program.title),options)})
            }, 500);
            } else {
                TimerMixin.setTimeout(() => {
                    this.setState(err)
                }, 1000);
            }
        });
    }

    valDebtOffsetCalc() {       
        waterfall([
            (callback) => {
                let req = {
                    "idPaymentForm": repo.configuration.getField('idPaymentFormSelected'),
                    "programType": this.program.type,
                    "amountToPay": this.state.data.totalAmount
                };
                bannerService.valDebtOffsetCalc(req, callback);
            }
        ], (err, result) => {
            if (!err) {
                this.addProgramSubscriber()
            } else {
                TimerMixin.setTimeout(() => {
                    this.setState(err)
                }, 1000);
            }
        });
    }

    loadData() {
        waterfall([
            (callback) => {
                let req = {
                    "idPaymentForm": repo.configuration.getField('idPaymentFormSelected'),
                    "programType": this.program.type
                };
                bannerService.debtOffsetCalc(req, callback);
            }
        ], (err, result) => {
            if (!err) {
                if (result && result.data) {
                    this.setState({
                        data: result.data
                    });
                } else {
                    this.setState({
                        data: emptyData
                    });
                }
            } else {
                TimerMixin.setTimeout(() => {
                    this.setState(err)
                }, 1000);
            }
        });
    }

    onGoBack(){
        let options =  {
            1: {
                key: 'button1',
                text: `${I18n.t('accept')}`,
                action: () => {
                    TimerMixin.setTimeout(() => {
                        this.props.navigation.dispatch(backAction);
                    }, 500);
                },
                align: ''
            },
            2: {
                key: 'button2',
                text: `${I18n.t('Cancel')}`,
                align: ''
            }
        };

        TimerMixin.setTimeout(() => {
            this.setState({
                messageAlert: createAlert(I18n.t("INFO"), I18n.t("PROGRAM_SUSCRIBE_QUIT"),options)
            });
        }, 500);
    }

    render() {
        return (
            <Container>
                <Header {...this.props} noDrawer
                                        iconAction={true}/>
                <SubHeader text={I18n.t('DEBT_CONDONATION_TITLE')} back onBack={this.onGoBack.bind(this)} {...this.props}/>
                <PopupDialog
                    refModal={this.state.messageAlert}
                />
                <Content padderHorizontal>
                    <ListItem column borderDark>
                        <Row style={{ ...styles.listItemRow.self, ...sharedStyles.margin('top', 4) }}>
                            <Left flex08 style={styles.listItemRow.left}>
                                <Text sizeNormal light
                                      style={styles.publicItemRow.text}>{I18n.t('DEBT_BILL_CYCLE')}</Text>
                            </Left>
                            <Body>
                            <Text sizeNormal heavy>{this.state.data.debtBillCycle}</Text>
                            </Body>
                        </Row>
                        <Row style={{...styles.listItemRow.self, ...sharedStyles.margin('top', 4)}}>
                            <Left flex08 style={styles.listItemRow.left}>
                                <Text sizeNormal light
                                      style={styles.publicItemRow.text}>{I18n.t('DEBT_OTHER_CHARGES')}</Text>
                            </Left>
                            <Body>
                            <Text sizeNormal heavy>{this.state.data.debtOtherCharges}</Text>
                            </Body>
                        </Row>
                        <Row style={{...styles.listItemRow.self, ...sharedStyles.margin('top', 4)}}>
                            <Left flex08 style={styles.listItemRow.left}>
                                <Text sizeNormal light
                                      style={styles.publicItemRow.text}>{I18n.t('CONDONATION_BILL_CYCLE')}</Text>
                            </Left>
                            <Body>
                            <Text sizeNormal heavy>{this.state.data.condonationBillCycle}</Text>
                            </Body>
                        </Row>
                        <Row style={{...styles.listItemRow.self, ...sharedStyles.margin('top', 4)}}>
                            <Left flex08 style={styles.listItemRow.left}>
                                <Text sizeNormal light
                                      style={styles.publicItemRow.text}>{I18n.t('CONDONATION_OTHER_CHARGES')}</Text>
                            </Left>
                            <Body>
                            <Text sizeNormal heavy>{this.state.data.condonationOtherCharges}</Text>
                            </Body>
                        </Row>
                        <Row style={{...styles.listItemRow.self, ...sharedStyles.margin('top', 4)}}>
                            <Left flex08 style={styles.listItemRow.left}>
                                <Text sizeNormal light style={styles.publicItemRow.text}>{I18n.t('TOTAL_AMOUNT')}</Text>
                            </Left>
                            <Body>
                            <Text sizeNormal heavy>{this.state.data.totalAmount}</Text>
                            </Body>
                        </Row>
                    </ListItem>
                </Content>

                <Footer noBorders padder>
                    <FooterTab>
                        {platformStyle.platform === 'android' ?
                            <Button block rounded style={{ backgroundColor: platformStyle.brandPrimary}}
                                    onPress={this.props.handleSubmit(this.submit.bind(this))}>
                                <Text sizeNormal>{I18n.t('GO_PAY')}</Text>
                            </Button> : null}
                    </FooterTab>
                </Footer>
                <Spinner visible={this.state.spinnerVisible} textContent={I18n.t('Loading')}
                         overlayColor={`rgba(0, 0, 0, 0.60)`}
                         textStyle={{ color: '#FFF' }}/>

            </Container>
        );
    }
}

const DebtCondonation = reduxForm({
    form: "DebtCondonationForm"
})(DebtCondonationScreen);

function bindAction(dispatch) {
    return {};
}

const mapStateToProps = state => {
    return {
        initialValues: {}
    }
};

export default connect(mapStateToProps, bindAction)(DebtCondonation);
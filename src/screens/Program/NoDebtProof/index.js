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
import Config from 'react-native-config'

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

const isoCodeDefault= '$';

class NoDebtProofScreen extends Component {

    constructor(props) {
        super(props);

        this.state = {
            data: emptyData,
            sendButtonEnabled:true,
            chargeCreated:false,
            spinnerVisible: false
        }
    }

    componentDidMount() {
        repo.configuration.setField('adpProgramData',""); //In order to avoid program interference
        this.loadData();
    }

    componentWillReceiveProps( nextProps ) {
        if( this.props.paymentRefresh !== nextProps.paymentRefresh  ) {
            console.log("NoDebtProof -> paymentRefresh");
            TimerMixin.setTimeout(() => {
                this.props.navigation.dispatch(backAction);
            }, 200);
        }
    }

    submit(values) {

        if(this.state.chargeCreated){
            this.setState({messageAlert: createAlert(I18n.t("PROGRAM_INFO_ADP"), I18n.t("NO_DEBT_PROOF_CHARGE_CREATED"))});
            return;
        }

        this.setState({sendButtonEnabled:false});

        waterfall([
            (callback) => {
                let req = {
                    "idPaymentForm": repo.configuration.getField('idPaymentForm'),
                };
                bannerService.generateCharge(req, callback);               
            }
        ], (err, result) => {
            if (!err) {
                if (result && result.data) {
                    TimerMixin.setTimeout(() => {
                        this.setState({sendButtonEnabled:true,spinnerVisible: false,chargeCreated:true},function(){
                            this.props.navigation.navigate('PaymentScreen', {
                                indPrepayment: false,
                                amount: this.state.data.totalAmount,
                                listBills: [{"billList":[{"idBill":result.data.idBill}]}],
                                idPaymentForm: repo.configuration.getField('idPaymentForm'),
                                reload: () => {
                                    this.toggleSwitch(this.state.swich).bind(this);
                                }
                            })
                        });
                    }, 1000);
                } else {
                    TimerMixin.setTimeout(() => {
                        this.setState({sendButtonEnabled:true,messageAlert: createAlert(I18n.t("PROGRAM_INFO_ADP"), I18n.t("NO_DATA_FOUND")),spinnerVisible: false})
                    }, 1000);
                }
            } else {
                TimerMixin.setTimeout(() => {
                    this.setState({...err,spinnerVisible: false,sendButtonEnabled:true})
                }, 1000);
            }
        });


    }

    loadData() {
        this.setState({
            spinnerVisible: true,
            sendButtonEnabled:false
        });

        let req2 = {
            "idPaymentForm": repo.configuration.getField('idPaymentForm')
        };
        bannerService.valDebtAccount(req2, (err, result) => {
            if(!err){
                let req = {
                    "idPaymentForm": repo.configuration.getField('idPaymentForm'),
                };
                bannerService.noDebtProof(req, (err, result) => {
                    if (!err) {
                        if (result && result.data) {
                            this.setState({
                                data: result.data,
                                spinnerVisible: false,
                                sendButtonEnabled:true
                            });
                        } else {
                            this.setState({
                                data: emptyData,
                                spinnerVisible: false,
                                sendButtonEnabled:false
                            });
                        }
                    } else {
                        TimerMixin.setTimeout(() => {
                            this.setState({...err,spinnerVisible: false,sendButtonEnabled:false})
                        }, 1000);
                    }
                });
            }else{
                TimerMixin.setTimeout(() => {
                    this.setState({...err,spinnerVisible: false,sendButtonEnabled:false})
                }, 1000);
            }
        });
    }

    render() {
        return (
            <Container>
                <Header {...this.props} noDrawer
                                        iconAction={true}/>
                <SubHeader text={I18n.t('NO_DEBT_PROOF_TITLE')} back {...this.props}/>
                <PopupDialog
                    refModal={this.state.messageAlert}
                />
                <Content padderHorizontal>
                    <ListItem column borderDark>
                        <Row style={{ ...styles.listItemRow.self, ...sharedStyles.margin('top', 4) }}>
                            <Left flex08 style={styles.listItemRow.left}>
                                <Text sizeNormal light
                                      style={styles.publicItemRow.text}>{I18n.t('NO_DEBT_PROOF_AMOUNT')}</Text>
                            </Left>
                            <Body>
                            <Text sizeNormal heavy>{this.state.data.amount? isoCodeDefault + this.state.data.amount:'' }</Text>
                            </Body>
                        </Row>
                        <Row style={{...styles.listItemRow.self, ...sharedStyles.margin('top', 4)}}>
                            <Left flex08 style={styles.listItemRow.left}>
                                <Text sizeNormal light
                                      style={styles.publicItemRow.text}>{I18n.t('NO_DEBT_PROOF_TAX')}</Text>
                            </Left>
                            <Body>
                            <Text sizeNormal heavy>{this.state.data.tax? isoCodeDefault + this.state.data.tax:'' }</Text>
                            </Body>
                        </Row>
                        <Row style={{...styles.listItemRow.self, ...sharedStyles.margin('top', 4)}}>
                            <Left flex08 style={styles.listItemRow.left}>
                                <Text sizeNormal light
                                      style={styles.publicItemRow.text}>{I18n.t('NO_DEBT_PROOF_TOTAL_AMOUNT')}</Text>
                            </Left>
                            <Body>
                            <Text sizeNormal heavy>{this.state.data.totalAmount? isoCodeDefault + this.state.data.totalAmount:''}</Text>
                            </Body>
                        </Row>
                    </ListItem>
                </Content>


                <Footer noBorders padder>
                    <FooterTab>
                        <Button block rounded style={{ backgroundColor: platformStyle.brandPrimary}}
                                onPress={this.props.handleSubmit(this.submit.bind(this))}
                                disabled={!this.state.sendButtonEnabled}
                        >
                            <Text sizeNormal>{I18n.t('GO_PAY')}</Text>
                        </Button>
                    </FooterTab>
                </Footer>

                <Spinner visible={this.state.spinnerVisible} textContent={I18n.t('Loading')}
                         overlayColor={`rgba(0, 0, 0, 0.60)`}
                         textStyle={{ color: '#FFF' }}/>

            </Container>
        );
    }
}

const NoDebtProof = reduxForm({
    form: "NoDebtProofForm"
})(NoDebtProofScreen);

function bindAction(dispatch) {
    return {};
}

const mapStateToProps = state => {
    return {
        initialValues: {},
        paymentRefresh: state.generalReducer.paymentRefresh
    }
};

export default connect(mapStateToProps, bindAction)(NoDebtProof);
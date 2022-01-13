import React, {Component} from "react";
import {TouchableOpacity} from 'react-native';
import {Text, Content, Container, Left, Body, ListItem, Row, View, Icon, Footer, FooterTab, Button} from "native-base";
import {FlatList} from 'react-native';
import I18n from 'react-native-i18n';
import {connect} from 'react-redux';
import TimerMixin from "react-timer-mixin";
import {Field, reduxForm} from "redux-form";
import { NavigationActions } from 'react-navigation';

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
import { required } from '../../../shared/validations';

import FormField from '../../../components/FormField/';

const backAction = NavigationActions.back({
    key: null
});

class AnnualPaymentScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data:{
                currentDebit:"",
                annualPaymBillAmount:"",
                totalAmountDebt:"",
                billList: []

            },
            spinnerVisible: false
        }
    }

    componentDidMount(){
        let adpProgram = repo.configuration.getField('adpProgramData');      
        if(adpProgram!=null && adpProgram.length){
            let program = JSON.parse(adpProgram);
            this.program = program;
        }
        this.loadData();
    }

    submit(values) {       
        this.props.navigation.navigate('PaymentScreen',{
            indPrepayment:false,
            amount: this.state.data.totalAmountDebt,
            listBills: [{billList: this.state.data.billList.map(item => ({idBill: item}))}],
            idPaymentForm: repo.configuration.getField('idPaymentFormSelected'),
            paymentDone: () => {
                this.paymentDoneOK();
            }
        });       
    }
    
    paymentDoneOK(){
        let options =  {
            1: {
                key: 'button1',
                text: `${I18n.t('accept')}`,
                action: () => {
                    TimerMixin.setTimeout(() => {
                        this.props.navigation.dispatch(backAction);
                    }, 200);
                },
                align: ''
            }
        };
        TimerMixin.setTimeout(() => {
            this.setState({messageAlert: createAlert(I18n.t("PROGRAM_INFO_ADP"), I18n.t("PROGRAM_SUSCRIBE_DONE").replace("{program}",this.program.title),options)})
        }, 500);
    }

    loadData(){
        waterfall([
            (callback ) => {
                let req = {
                    "idPaymentForm": repo.configuration.getField('idPaymentFormSelected')
                };  
                bannerService.getDataAnnualPayment(req, callback);
            }
        ], ( err, result ) => {
            if(!err){
                if(result){                  
                    this.setState({
                        data: result.data,
                    });
                } else {
                    this.setState({data:{
                        currentDebit:"",
                        annualPaymBillAmount:"",
                        totalAmountDebt:"",
                        billList: []
                    }});
                }
            }else{
                TimerMixin.setTimeout(() => {
                    this.setState(err)
                }, 1000);
            }
        });
    }

    render() {
        return (
            <Container>
                <Header {...this.props} noDrawer
                                        iconAction={true}/>
                <SubHeader text={I18n.t('ANNUAL_PAYMENT_SCREEN')} back {...this.props}/>
                <PopupDialog
                    refModal={this.state.messageAlert}
                />
                <Content padderHorizontal>
                    <ListItem column borderDark>
                        <Row style={{ ...styles.listItemRow.self, ...sharedStyles.margin('top', 4) }}>
                            <Left flex08 style={styles.listItemRow.left}>
                                <Text sizeNormal light style={styles.publicItemRow.text}>{I18n.t('ANNUAL_PAYMENT_CURRENT')}</Text>
                            </Left>
                            <Body>
                            <Text sizeNormal heavy>{this.state.data.currentDebit}</Text>
                            </Body>
                        </Row>
                        <Row style={{...styles.listItemRow.self, ...sharedStyles.margin('top', 4)}}>
                            <Left flex08 style={styles.listItemRow.left}>
                                <Text sizeNormal light style={styles.publicItemRow.text}>{I18n.t('ANNUAL_PAYMENT_SCREEN')}</Text>
                            </Left>
                            <Body>
                            <Text sizeNormal heavy>{this.state.data.annualPaymBillAmount}</Text>
                            </Body>
                        </Row>
                        <Row style={{ ...styles.listItemRow.self, ...sharedStyles.margin('top', 4) }}>
                            <Left flex08 style={styles.listItemRow.left}>
                                <Text sizeNormal light style={styles.publicItemRow.text}>{I18n.t('ANNUAL_PAYMENT_TOTAL')}</Text>
                            </Left>
                            <Body>
                            <Text sizeNormal
                                  heavy>{this.state.data.totalAmountDebt}</Text>
                            </Body>
                        </Row>
                    </ListItem>
                </Content>

                <Footer noBorders padder>
                    <FooterTab>
                        <Button block rounded style={{ backgroundColor: platformStyle.brandPrimary}}
                            onPress={this.props.handleSubmit(this.submit.bind(this))}>
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

const AnnualPayment = reduxForm({
    form: "AnnualPaymentForm"
})(AnnualPaymentScreen);

function bindAction(dispatch) {
    return {};
}

const mapStateToProps = state => {
    return {
        initialValues: {}
    }
};

export default connect(mapStateToProps, bindAction)(AnnualPayment);
import React, {Component} from "react";
import {Image, FlatList} from 'react-native';
import {Text, Content, Container, Left, Body, ListItem, Row,Footer, FooterTab, Button} from "native-base";
import {Field} from "redux-form";
import I18n from 'react-native-i18n';
import { NavigationActions } from 'react-navigation';
import {connect} from 'react-redux';
import TimerMixin from "react-timer-mixin";

import NoDataFound from '../../../components/NoDataFound/';
import Header from '../../../components/Header';
import SubHeader from '../../../components/SubHeader';
import sharedStyles from '../../../shared/styles';
import styles from './styles'
import bannerService from "../../../services/general/bannerService";
import waterfall from "async/waterfall";
import repo from "../../../services/database/repository";
import Spinner from '../../../components/Spinner';
import PopupDialog from '../../../components/PopupDialog/';
import { formatLocaleDate } from '../../../shared/validations';
import {platformStyle} from "../../../theme";
import {createAlert} from '../../../components/ScreenUtils';

const backAction = NavigationActions.back({
    key: null
});

class PeriodExtension extends Component {

    constructor() {
        super();
        this.state = {
            data: [],
            spinnerVisible: false,
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

    loadData() {
        this.setState({
            spinnerVisible: true
        });

        waterfall([
            (callback) => {
                let req = {
                    "idPaymentForm": repo.configuration.getField('idPaymentFormSelected'),
                    //"idPaymentForm": 134,
                };
                bannerService.searchBillExtendInstalment(req, callback);
            }
        ], (err, result) => {
            if (!err) {
                if (result && result.data) {
                    this.data = result.data;
                    if(this.data && this.data.length){
                        this.extendInstalmentBillService(false);
                    }else{
                        TimerMixin.setTimeout(() => {
                            this.setState({
                                messageAlert: createAlert(I18n.t("INFO"), I18n.t("NO_DATA")),
                                spinnerVisible: false
                            });
                        }, 500);
                    }
                }
            } else {
                TimerMixin.setTimeout(() => {
                    this.setState({...err,spinnerVisible: false});
                }, 1000);
            }
        });
        
    }

    extendInstalmentBillService(flag){
        const navigation = this.props.navigation;
        waterfall([
            (callback) => {
                let req = {
                    "programType": this.program.type,
                    "flagValue":flag,
                    "billMassiveList":this.data
                };
                bannerService.extendInstalmentBill(req, callback);
            }
        ], (err, result) => {
            if (!err) {
                if(flag){
                    //this.showSuccessMessage(navigation);
                    //PIEI-56893 SS Web - Pantalla ampliación de plazos
                    this.adhereProgram();
                }else{
                    this.data = result.data.billMassiveList;
                    this.setState({data:this.data,spinnerVisible: false});
                }
            } else {
                TimerMixin.setTimeout(() => {
                    this.setState({...err,spinnerVisible: false});
                }, 1000);
            }
        });
    }

    adhereProgram() {
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
                    this.setState({messageAlert: createAlert(I18n.t("PROGRAM_INFO_ADP"), I18n.t("PROGRAM_SUSCRIBE_DONE").replace("{program}",this.program.title),options),spinnerVisible: false})
                }, 500);
            } else {
                TimerMixin.setTimeout(() => {
                    this.setState({...err,spinnerVisible: false});
                }, 1000);
            }
        });
    }

    submit() {
        this.extendInstalmentBillService(true);
    }

    //COMMENTED DUE TO PIEI-56893 SS Web - Pantalla ampliación de plazos
    // showSuccessMessage(navigation){
    //     let options =  {
    //         1: {
    //             key: 'button1',
    //             text: `${I18n.t('accept')}`,
    //             action: () => {
    //                 TimerMixin.setTimeout(() => {
    //                     this.props.navigation.navigate(this.program.screen3);
    //                 }, 500);
    //             },
    //             align: ''
    //         }
    //     };
    //
    //     TimerMixin.setTimeout(() => {
    //         this.setState({
    //             messageAlert: createAlert(I18n.t("INFO"), I18n.t("OPERATION_SUCCESS2"),options)
    //         });
    //     }, 500);
    // }

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

    renderItem({item}) {
        return (
            <ListItem column borderDark>
                <Row style={{ ...styles.listItemRow.self, ...sharedStyles.margin('top', 2) }}>
                    <Left flex06 style={styles.listItemRow.left}>
                        <Text sizeNormal light style={styles.publicItemRow.text}>{I18n.t('PERIOD_EXTENSION_NOTICE')}</Text>
                    </Left>
                    <Body>
                    <Text sizeNormal heavy>{item.noticeNumber}</Text>
                    </Body>
                </Row>
                <Row style={styles.listItemRow.self}>
                    <Left flex06 style={styles.listItemRow.left}>
                        <Text sizeNormal light style={styles.publicItemRow.text}>{I18n.t('PERIOD_EXTENSION_BILL_NUMBER')}</Text>
                    </Left>
                    <Body>
                    <Text sizeNormal heavy>{item.billNumber}</Text>
                    </Body>
                </Row>
                <Row style={{ ...styles.listItemRow.self, ...sharedStyles.margin('top', 2) }}>
                    <Left flex06 style={styles.listItemRow.left}>
                        <Text sizeNormal light style={styles.publicItemRow.text}>{I18n.t('PERIOD_EXTENSION_TOTAL_AMOUNT')}</Text>
                    </Left>
                    <Body>
                    <Text sizeNormal
                          heavy>{item.totalAmount}</Text>
                    </Body>
                </Row>
                <Row style={{ ...styles.listItemRow.self, ...sharedStyles.margin('top', 2) }}>
                    <Left flex06 style={styles.listItemRow.left}>
                        <Text sizeNormal light style={styles.publicItemRow.text}>{I18n.t('PERIOD_EXTENSION_PENDING_AMOUNT')}</Text>
                    </Left>
                    <Body>
                    <Text sizeNormal
                          heavy>{item.pendingAmount}</Text>
                    </Body>
                </Row>
                <Row style={{ ...styles.listItemRow.self, ...sharedStyles.margin('top', 2) }}>
                    <Left flex06 style={styles.listItemRow.left}>
                        <Text sizeNormal light style={styles.publicItemRow.text}>{I18n.t('PERIOD_EXTENSION_CREATION_DATE')}</Text>
                    </Left>
                    <Body>
                    <Text sizeNormal
                          heavy>{(item.creationDate ? formatLocaleDate(item.creationDate) : '-')}</Text>
                    </Body>
                </Row>

                <Row style={{ ...styles.listItemRow.self, ...sharedStyles.margin('top', 2) }}>
                    <Left flex06 style={styles.listItemRow.left}>
                        <Text sizeNormal light style={styles.publicItemRow.text}>{I18n.t('PERIOD_EXTENSION_EXPIRATION_DATE')}</Text>
                    </Left>
                    <Body>
                    <Text sizeNormal
                          heavy>{(item.expirationDate ? formatLocaleDate(item.expirationDate) : '-')}</Text>
                    </Body>
                </Row>

                <Row style={{ ...styles.listItemRow.self, ...sharedStyles.margin('top', 2) }}>
                    <Left flex06 style={styles.listItemRow.left}>
                        <Text sizeNormal light style={styles.publicItemRow.text}>{I18n.t('PERIOD_EXTENSION_EXPIRATION_EXTEND')}</Text>
                    </Left>
                    <Body>
                    <Text sizeNormal
                          heavy>{(item.periodName ? item.periodName : '-')}</Text>
                    </Body>
                </Row>

                
            </ListItem>
        )
    }

    _keyExtractor = (item, index) => index.toString();

    render() {
        return (
            <Container>
                <Header {...this.props} noDrawer
                                        iconAction={true}/>
                <SubHeader text={I18n.t('PERIOD_EXTENSION_TITLE')} back={true} onBack={this.onGoBack.bind(this)}
                    {...this.props}/>

                <PopupDialog
                    refModal={this.state.messageAlert}
                />
                <Content padder>
                    <FlatList data={this.state.data}
                              style={sharedStyles.margin('bottom', 5)}
                              renderItem={this.renderItem}
                              keyExtractor={this._keyExtractor}
                              ListEmptyComponent={NoDataFound}
                    />
                </Content>
                <Footer noBorders padder>
                    <FooterTab>
                        {platformStyle.platform === 'android' ?
                            <Button block rounded style={{ backgroundColor: platformStyle.brandPrimary}}
                                    onPress={this.submit.bind(this)}>
                                <Text sizeNormal>{I18n.t('SAVE')}</Text>
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


Component.propTypes = {};

function bindAction(dispatch) {
    return {};
}

const mapStateToProps = state => ({});

export default connect(mapStateToProps, bindAction)(PeriodExtension);

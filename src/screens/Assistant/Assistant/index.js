import React, {Component} from "react";
import {Image} from 'react-native';
import {Text, View, Container, Footer, FooterTab, Button, Row,Content} from "native-base";
import {Field} from "redux-form";
import I18n from 'react-native-i18n';
import Config from 'react-native-config';
import {connect} from 'react-redux';
import TimerMixin from "react-timer-mixin";
import {NavigationActions} from 'react-navigation';

import styles from './styles';
import waterfall from 'async/waterfall';
import repo from '../../../services/database/repository';
import Header from '../../../components/Header';
import SubHeader from '../../../components/SubHeader';
import {platformStyle} from "../../../theme";
import firebaseService from "../../../services/firebase/firebaseService";
import PopupDialog from '../../../components/PopupDialog/';
import assistantService from '../../../services/general/assistantService';
import cfdiService from '../../../services/general/cfdiService';
import {createAlert} from '../../../components/ScreenUtils';
import generalService from '../../../services/general/generalService';


const backAction = NavigationActions.back({
    key: null
});
class Assistant extends Component {

    constructor() {
        super();
        this.state = {
            showSuscribeElectronicBill:false,
            showEbilling:false,
            moreThanOneAccount:false,
            showOptions:false
        }
    }

    componentDidMount() {
        TimerMixin.setTimeout(() => {
            this.showPopupAlert( I18n.t("INFO"), I18n.t("OnlineAdvisory") );
        }, 1000);
        const {params} = this.props.navigation.state;
        firebaseService.supervisorAnalytic('REMOTE_ASSISTANT');
        this.isDataUpdateNeeded();
    }

    isDataUpdateNeeded(){
        this.setState({
            spinnerVisible: true,
            showSuscribeElectronicBill:false,
            showEbilling:false,
            moreThanOneAccount:false,
            showOptions:false
        });
        waterfall([
            (callback ) => {
                let idCustomer = repo.configuration.getField('idCustomer');
                assistantService.isDataUpdateNeeded(idCustomer, callback);
            }
        ], ( err, result ) => {
            if(!err){
                if(result){
                    if(result.updateDataNeeded){
                        this.showPersonalData();
                    }else if (result.moreThanOneAccount){
                        this.setState({
                            spinnerVisible: false,
                            moreThanOneAccount: true,
                            showOptions:true
                        });
                    }else{
                        if(result.indCFDINeedSuscribe){
                            this.setState({
                                showSuscribeElectronicBill: true,
                                idPaymentForm:result.idPaymentForm
                            });
                        }
                        this.checkEbilling(result.idPaymentForm);
                    }

                } else {
                    this.setState({ data: null, spinnerVisible: false});
                }
            }else{
                this.setState({ spinnerVisible: false }, function() {
                    TimerMixin.setTimeout(() => {
                        this.setState({...err,spinnerVisible: false});
                    }, 1000);
                }.bind(this));
            }
        });
    }

    checkEbilling(idPaymentForm) {
        let customerData = JSON.parse(repo.configuration.getField('customerData'));

        waterfall([
            ( callback ) => {
                generalService.billsPaperLessAction(idPaymentForm, callback);
            }
        ], ( err, result ) => {
            if( !err ) {
                if( result && result.data ) {
                    this.setState({ spinnerVisible: false,showEbilling:false,showOptions:true,idPaymentForm: idPaymentForm});
                } else {
                    this.setState({ spinnerVisible: false,showEbilling:true,showOptions:true,idPaymentForm: idPaymentForm});
                }
            } else {
                TimerMixin.setTimeout(() => {
                    this.showPopupAlert(I18n.t("INFO"), I18n.t("NO_DATA") + " : " + err);
                }, 1000);
            }
        })
    }

    showPersonalData() {
        this.setState({
            spinnerVisible: false,
            showOptions:false,
            messageAlert: createAlert(I18n.t("INFO"), I18n.t("REMOTE_ASSISTANT_UPDATE"), {
                1: {
                    key: 'button1',
                    text: `${I18n.t('accept')}`,
                    action: () => {
                        TimerMixin.setTimeout(() => {
                            this.props.navigation.navigate('MyData');
                        }, 500);
                    },
                    align: ''
                }
            })
        });

    }

    showAvailableProcedures() {
        this.props.navigation.navigate('AvailableProcedures');
    }

    showHistoricProcedures() {
        this.props.navigation.navigate('HistoricProcedures');
    }

    showEBilling() {
        this.props.navigation.navigate('AccountRequestEBilling',{
            idPaymentForm: this.state.idPaymentForm,
            onGoBack: () => this.isDataUpdateNeeded()
        });
    }

    /**
   *
   * @param title
   * @param text
   * @param content
   * @param options
   */
  showPopupAlert( title, text, content, options ) {
    this.setState({
      messageAlert: {
        refresh: new Date().valueOf(),
        outside: false,
        title: title,
        height: 300,
        animation: 2,
        contentText: text,
        content: content,
        options: options ? options : {
          1: {
            key: 'button1',
            text: `${I18n.t('accept')}`,
            align: ''
          }
        },
      }

    })
  }

    suscribeElectronicBill(){
        waterfall([
            (callback ) => {
                let req = {
                    "idPaymentForm": repo.configuration.getField('idPaymentForm')
                };
                cfdiService.subscribeCFDI(req,callback);
            }
        ], ( err, result ) => {
            if(!err){
                TimerMixin.setTimeout(() => {
                    this.isDataUpdateNeeded();
                }, 500);
                this.setState({
                    messageAlert: createAlert(I18n.t("INFO"), I18n.t("OPERATION_SUCCESS2"))
                });

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
                <Header {...this.props} noDrawer iconAction={true}/>
                <SubHeader text={I18n.t('REMOTE_ASSISTANT')} back={true} {...this.props}/>
                <PopupDialog refModal={this.state.messageAlert}/>
                <Content padderHorizontal>

                    {this.state.showSuscribeElectronicBill || this.state.showEbilling || this.state.moreThanOneAccount ?
                    <View style={styles.slide1}>
                        <View style={styles.container}>
                            <View><Text xlarge heavy style={{color: platformStyle.brandPrimary}}>{I18n.t('REMOTE_ASSISTANT_SUSCRIPTIONS')}</Text></View>
                        </View>
                    </View>:null}

                    {this.state.showSuscribeElectronicBill?
                    <Button wide style={{backgroundColor:platformStyle.brandPrimary,marginTop:10}}
                            block
                            rounded
                            onPress={() =>{
                                   this.suscribeElectronicBill();
                              }}>
                        <Text sizeNormal>{I18n.t('SUSCRIBE_ELECTRONIC_BILL')}</Text>
                    </Button>:null}

                    {this.state.showEbilling?
                    <Button wide style={{backgroundColor:platformStyle.brandPrimary,marginTop:10}}
                            block
                            rounded
                            onPress={() =>{
                                   this.showEBilling();
                              }}>
                        <Text sizeNormal>{I18n.t('REQUEST_EBILLING')}</Text>
                    </Button>:null}

                    {this.state.moreThanOneAccount?
                        <View style={styles.slide1}>
                            <View style={styles.container}>
                                <View><Text xlarge>{I18n.t('REMOTE_ASSISTANT_MORE_CONTRACTS')}</Text></View>
                            </View>
                        </View>
                        :null}


                    <View style={styles.slide1}>
                        <View style={styles.container}>
                            <View><Text xlarge heavy style={{color: platformStyle.brandPrimary}}>{I18n.t('REMOTE_ASSISTANT_PROCEDURES')}</Text></View>
                        </View>
                    </View>

                    {this.state.showOptions?
                    <Button wide style={{backgroundColor:platformStyle.brandPrimary,marginTop:10}}
                            block
                            rounded
                            onPress={() =>{
                                   this.showAvailableProcedures();
                              }}>
                        <Text sizeNormal>{I18n.t('REMOTE_ASSISTANT_AVAILABLE')}</Text>
                    </Button>:null}

                    {this.state.showOptions?
                    <Button wide style={{backgroundColor:platformStyle.brandPrimary,marginTop:10}}
                            block
                            rounded
                            onPress={() =>{
                                   this.showHistoricProcedures();
                              }}>
                        <Text sizeNormal>{I18n.t('REMOTE_ASSISTANT_HISTORIC')}</Text>
                    </Button>:null}
                  </Content>
            </Container>
        );
    }
}



Component.propTypes = {};

function bindAction(dispatch) {
    return {};
}

const mapStateToProps = state => ({});

export default connect(mapStateToProps, bindAction)(Assistant);
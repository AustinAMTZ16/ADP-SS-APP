import React, {Component} from "react";
import {Image} from 'react-native';
import {Text, View, Container, Footer, FooterTab, Button, Row,Content} from "native-base";
import {Field} from "redux-form";
import I18n from 'react-native-i18n';
import Config from 'react-native-config';
import {connect} from 'react-redux';
import TimerMixin from "react-timer-mixin";
import * as OpenAnything from 'react-native-openanything';

import styles from './styles';
import waterfall from 'async/waterfall';
import repo from '../../../services/database/repository';
import Header from '../../../components/Header';
import SubHeader from '../../../components/SubHeader';
import {platformStyle} from "../../../theme";
import firebaseService from "../../../services/firebase/firebaseService";
import PopupDialog from '../../../components/PopupDialog/';
import {createAlert} from '../../../components/ScreenUtils';
import generalService from '../../../services/general/generalService';

class AlertDetail extends Component {

    constructor() {
        super();
        this.state = {
            alert: {},
            createdSign:false,
            documentRead:false
        }
    }

    componentDidMount() {
        const {params} = this.props.navigation.state;
        firebaseService.supervisorAnalytic('ALERT_DETAIL');
        this.setState({alert: params.item,mode:params.mode});       
    }

    onSignatureCreated(param){        
        this.encodedSignature = param.encoded;
        this.setState({createdSign: true});
    }

    showPDF() {
        let idDocument = this.state.alert.idAlert;
        let endPoint = Config.ENDPOINT_ATTACHMENTS;
        let API_URL = repo.configuration.getField('domain');
        let filename = `${idDocument}.pdf`;
        let URL_FINAL = `${endPoint}downloadSignatureDoc/${idDocument}`;
        URL_FINAL = URL_FINAL.replace("{apiVersion}", repo.configuration.getField('apiVersion'));

        let TENANT = repo.configuration.getField('tenantId');
        if(Config.IS_MULTITENANT === "true" && TENANT.length){
            URL_FINAL = "/t/" + TENANT + URL_FINAL;
        }
        if(API_URL.substring(API_URL.length-1)=="/"){
            API_URL = API_URL.substring(0,API_URL.length-1);
        }
        URL_FINAL = API_URL + URL_FINAL;

        this.setState({documentRead: true}, this.props.navigation.navigate('ViewPDF',{
            downloadUrl: URL_FINAL,
            title: I18n.t('PREVIEW_PDF'),
            filename: filename
        }));
    }

    sendSignature(){
        let message = "";
        if(!this.state.documentRead){
            message=I18n.t("VALID_READ_DOC") + "\n" + "\n";
        }
        if(!this.state.createdSign){
            message+=I18n.t("VALID_SIGN_REQUIRED");
        }
        if(message){
            TimerMixin.setTimeout(() => {
                this.setState({
                    messageAlert: createAlert(I18n.t("INFO"), message)
                });
            }, 1000);
        }else{
            this.sendSignatureService();
        }
    }

    sendSignatureService(){
        waterfall([
            ( callback ) => {
                let data = new FormData();
                data.append('entityCode',this.state.alert.idAlert);
                data.append('entityType',"4600REFTYP");
                data.append('img', this.encodedSignature);
                data.append('imgCodDocum' , "0000DOCSIGNATURE");
                generalService.uploadFiles(data,callback);
            }
        ], ( err, result ) => {
            this.setState({ spinnerVisible: false }, function() {
                if(!err) {
                    this.setState({
                        messageAlert: createAlert(I18n.t("INFO"), I18n.t("DOCUMENT_SIGNED_OK"),{
                        1: {
                            key: 'button1',
                            text: I18n.t('accept'),
                            action: () => {
                                if(this.props.navigation.state.params.onGoBack){
                                    this.props.navigation.state.params.onGoBack();
                                }
                                this.props.navigation.goBack();
                            }
                        }
                    })
                    });
                } else {
                    TimerMixin.setTimeout(() => {
                        this.setState(err)
                    }, 1000);
                }
            });
        })
    }

    render() {
        return (
            <Container>
                <Header {...this.props} noDrawer iconAction={true}/>
                <SubHeader text={I18n.t('ALERT_DETAIL')} back={true} {...this.props}/>
                <PopupDialog refModal={this.state.messageAlert}/>
                <Content padderHorizontal>
                    <View style={styles.slide1}>
                        <View style={styles.container}>
                            <View><Text xlarge heavy style={{color: platformStyle.brandPrimary}}>{this.state.alert.nameType}</Text></View>
                        </View>
                        <Text large dark medium style={styles.textSlide}>{this.state.alert.description}</Text>
                    </View>

                    {this.state.mode=='SIGNATURE'?
                    <Button wide style={{backgroundColor: (this.state.documentRead?platformStyle.brandPrimary:'#c2d47d'),marginTop:10}}
                            block
                            rounded
                            onPress={() =>{
                                   this.showPDF();
                              }}>
                        <Text sizeNormal>{I18n.t('PREVIEW_PDF')}</Text>
                    </Button>:null}

                    {!this.state.alert.messageRead && this.state.mode=='SIGNATURE'?
                    <Button wide style={{backgroundColor: (this.state.createdSign?platformStyle.brandPrimary:'#c2d47d'),marginTop:10}}
                            block
                            rounded
                            onPress={() =>{
                                this.props.navigation.navigate('Signature',{onGoBack: (param) => this.onSignatureCreated(param)});
                          }}>
                        <Text sizeNormal>{I18n.t('SIGNATURE')}</Text>
                    </Button>:null}

                    {this.state.mode=='SIGNATURE'?
                    <Button wide style={{backgroundColor: (this.state.alert.messageRead?platformStyle.brandPrimary:'#c2d47d'),marginTop:10}}
                            block
                            rounded
                            disabled={this.state.alert.messageRead}
                            onPress={() =>{
                                this.sendSignature();                                  
                          }}>
                        <Text sizeNormal>{this.state.alert.messageRead?I18n.t('SIGN_DOC_ALREADY'):I18n.t('SIGN_DOC')}</Text>
                    </Button>
                        :null}

                    {this.state.mode=='NAVIGATION'?
                        <Button wide style={{backgroundColor: (this.state.createdSign?platformStyle.brandPrimary:'#c2d47d'),marginTop:10}}
                                block
                                rounded
                                onPress={() =>{
                                    let val = this.state.alert.description;
                                    var matches = val.match(/\bhttps?:\/\/\S+/gi);
                                    OpenAnything.Open(matches[0]);
                            }}>
                            <Text sizeNormal>{I18n.t('ALERT_DETAIL_WEB')}</Text>
                        </Button>
                        :null}
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

export default connect(mapStateToProps, bindAction)(AlertDetail);

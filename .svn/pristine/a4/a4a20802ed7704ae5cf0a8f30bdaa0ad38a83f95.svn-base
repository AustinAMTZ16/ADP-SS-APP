import React, { Component } from "react";
import I18n from 'react-native-i18n';
import Swiper from 'react-native-swiper';
import { Alert,BackHandler,TouchableOpacity,Image } from 'react-native';
import {Text,View,Left, Body, Row, Button} from "native-base";
import {platformStyle} from "../../theme";
import styles from "./styles";
import repo from '../../services/database/repository';
import bannerService from "../../services/general/bannerService";
import waterfall from "async/waterfall";
import * as OpenAnything from "react-native-openanything";
import TimerMixin from "react-timer-mixin";
import {createAlert} from '../../components/ScreenUtils';

export default class Banner extends React.Component {

    constructor( props ) {
        super( props );
        this.state = {
            data:[],
            messageAlert:null
        };
    }

    componentDidMount(){       
        this.load();
    }

    componentWillReceiveProps( nextProps ) {       
        if( this.props.refreshing !== nextProps.refreshing  ) {
            this.load();
        }
    }

    load(){
        let bannerCacheData = repo.configuration.getField('bannerListCacheData') + (1000 * 60 * 3);  //EACH 3 MIN CACHE REFRESH.
        let currentDate = new Date().getTime();

        // console.log("Banner lOAD . bannerCacheData: " + new Date(bannerCacheData) + " -- " + new Date(currentDate));
        // console.log("Banner lOAD . bannerCacheData2 : " + (currentDate>bannerCacheData));

        if(bannerCacheData && (bannerCacheData<currentDate)){
            this.loadData();
        }else{
            let bannerListCache = JSON.parse(repo.configuration.getField('bannerListCache'));
            this.setState({ data: bannerListCache});
        }
    }

    loadData(){
        waterfall([
            (callback ) => {
                let idDocument = repo.configuration.getField('idCustomer');
                bannerService.getBannerList(idDocument, callback);
            }
        ], ( err, result ) => {
            if(!err){
                repo.configuration.setField('bannerListCache', JSON.stringify(result));
                repo.configuration.setField('bannerListCacheData', new Date().getTime());
                if(result && result.length){
                    this.setState({                        
                        data: result
                    });
                } else {
                    this.setState({ data: []});
                }
            }else{
                TimerMixin.setTimeout(() => {
                    this.props.onShowMessage(err)
                }, 1000);
            }
        });
    }

    validateProgram(item) {
        //1. No contract Selected
        if(repo.configuration.getField('idPaymentFormSelected')==null){
            this.props.onShowMessage({messageAlert: createAlert(I18n.t("INFO"), I18n.t("UNLINK_CONTRACT_NECESSARY"))});
            return false;
        }

        waterfall([
            (callback) => {
                let req = {
                    "idPaymentForm": repo.configuration.getField('idPaymentFormSelected')                    
                };
                if(item.extensionProperty=="100PRGTYPE"){
                    bannerService.isRegisteredAnnualPayment(req,callback);
                }else{
                    req.programType = item.extensionProperty;
                    bannerService.isRegisteredOtherProgram(req,callback);
                }

            }
        ], (err, result) => {
            if (!err) {
                this.showValidationOK(item);
            } else {
                TimerMixin.setTimeout(() => {
                    this.props.onShowMessage(err);
                }, 1000);
            }
        });
    }

    showValidationOK(item){
        let screen1 = this.setProgramOptions(item);
        let options =  {
            1: {
                key: 'button1',
                text: `${I18n.t('accept')}`,
                action: () => {
                    this.props.onNavigate(screen1);
                },
                align: ''
            }
        };
        if(screen1){
            this.props.onShowMessage({messageAlert: createAlert(I18n.t("PROGRAM_INFO_ADP"), I18n.t("PROGRAM_SUSCRIBE_OK").replace("{program}",item.title),options)});
        }else{
            this.props.onShowMessage({messageAlert: createAlert(I18n.t("PROGRAM_INFO_ADP"), I18n.t("PROGRAM_NOT_EXIST"))});
        }


    }

    setProgramOptions(item){
        let screen1 = "";
        let screen2 = "";
        let screen3 = "";

        //let debtCondonationArray = ["200PRGTYPE","210PRGTYPE","220PRGTYPE","230PRGTYPE","240PRGTYPE","250PRGTYPE","600PRGTYPE"]

        if(item.extensionProperty=="100PRGTYPE"){
            screen1 = "AnnualPaymentScreen";
            screen2 = "";
            screen3 = ""; //NO HAY ADHERE SCREEN
        } else if(item.ssFlow=="SS001"){
            screen1 = "MyData";
            screen2 = "DebtCondonationScreen";
            screen3 = ""
        } else if(item.ssFlow=="SS003"){
            screen1 = "MyData";
            screen2 = "PeriodExtension";
            screen3 = "";
        } else if(item.ssFlow=="SS002"){
            screen1 = "MyData";
            screen2 = "ADHERE_DIRECTLY";
            screen3 = "";
        }

        repo.configuration.setField('adpProgramData',JSON.stringify({type:item.extensionProperty,account:repo.configuration.getField('idPaymentFormSelected'),screen1,screen2,screen3,url: item.url,title:item.title}));
        return screen1;
    }

    clickBanner(item){
        if(item.extensionProperty==""){
            OpenAnything.Open(item.url);
        }else{
            this.validateProgram(item);
        }
    }

    render() {
        if(this.state.messageAlert!=null){
            /* Instead of showing popup because it is component it is better to show error message on screen directly */
            return (
                <Text sizeNormal light style={{marginBottom: 15}}>
                    {this.state.messageAlert?"Banner: " + this.state.messageAlert.contentText:"Banner error"}
                </Text>
            );
        }

        if(this.state.data==null || this.state.data.length==0){
            return null;
        }

        return (
            <View style={{height:120}}>
                <Swiper autoplay
                        autoplayTimeout={10}
                        activeDotStyle={{
                          backgroundColor: platformStyle.brandPrimary,
                          marginTop: 120
                        }}
                        dotStyle={{
                          backgroundColor: '#CCCCCC',
                          marginTop: 120
                        }}>

                    {_.map(this.state.data, ( item, index ) =>
                        <View key={item.bannerId}>
                            <TouchableOpacity onPress={() =>this.clickBanner(item)}>
                            <Image
                                    resizeMode={"contain"}
                                    style={styles.image}
                                    source={{
                                uri: item.urlImgSmall
                              }}
                                />
                            </TouchableOpacity>
                        </View>
                        )
                    }
                </Swiper>               
            </View>
        );
    }
}
import React, { Component } from "react";
import { TouchableOpacity } from 'react-native';
import { Text, Content, Container, Left, Body, ListItem, Row, View, Icon, Button} from "native-base";
import { FlatList } from 'react-native';
import I18n from 'react-native-i18n';
import { connect } from 'react-redux';
import TimerMixin from "react-timer-mixin";
import { Field, reduxForm } from "redux-form";

import {platformStyle} from "../../../theme";
import Header from '../../../components/Header';
import SubHeader from '../../../components/SubHeader';
import sharedStyles from '../../../shared/styles';
import styles from './styles'
import waterfall from "async/waterfall";
import repo from '../../../services/database/repository'
import Spinner from '../../../components/Spinner';
import moment from 'moment-timezone';
import NoDataFound from '../../../components/NoDataFound/';
import { formatLocaleDate,getDateFromLocaleFormat } from '../../../shared/validations';
import {createAlert} from '../../../components/ScreenUtils';
import cfdiService from "../../../services/general/cfdiService";
import PopupDialog from '../../../components/PopupDialog/';
import FormPickerDate from '../../../components/FormPickerDate/'

class RequestElectronicBillScreen extends Component {
	constructor( props ) {
		super(props);

		this.state = {
            originalData:[],
			data: [],
			spinnerVisible: false
		}
        this.from = null;
        this.to = null;
	}

	
	componentDidMount() {
		this.loadData();
	}

	loadData(callbackFun){
        this.setState({ spinnerVisible: true});
        if(!callbackFun){
            callbackFun = function(){};
        }
		waterfall([
			( callback ) => {
                let req = {
                    "idPaymentForm": repo.configuration.getField('idPaymentForm'),
                    //"idPaymentForm":4402,
                    "fromDate": new Date(1983,10,10).getTime(),
                    "endDate": new Date(2100,10,10).getTime()
                };
                cfdiService.getWithoutCFDI(req,callback);
			},
			], ( err, result ) => {
                if(!err){
                    if(result &&  result.data.length){
                        this.setState({ data: result.data,spinnerVisible: false,originalData: result.data },callbackFun);
                    }else{
                        this.setState({spinnerVisible: false });
                    }
                }else{
                    TimerMixin.setTimeout(() => {
                        this.setState({...err,spinnerVisible: false});
                    }, 1000);
                }
		});
	}

    createCFDI(item){
        let options =  {
            1: {
                key: 'button1',
                text: `${I18n.t('accept')}`,
                action: () => this.suscribeElectronicBill(item),
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
                messageAlert: createAlert(I18n.t("INFO"), I18n.t("CREATE_ELECTRONIC_BILL_CONFIRMATION"),options)
            });
        }, 500);
    }

    suscribeElectronicBill(item){
        this.setState({spinnerVisible: true});
        waterfall([
            (callback ) => {
                var req = {
                    "list": [
                    {
                        "idCfdi": item.idCfdi,
                        "idPaymentForm": repo.configuration.getField('idPaymentForm'),
                        "idOnlineCollection": item.idOnlineCollection
                        // "idNotice": 20000031,
                        // "idBill":20000069
                    }]};
                cfdiService.createCFDI(req,callback);
            }
        ], ( err, result ) => {
            if(!err){
                this.setState({
                    messageAlert: createAlert(I18n.t("INFO"), I18n.t("OPERATION_SUCCESS2")),spinnerVisible: false
            }, function(){
                    this.loadData(this.updateData);
                    
                    //UPDATE list from previous screenWITH CFDI
                    if(this.props.navigation.state.params.refreshCFDI){
                        this.props.navigation.state.params.refreshCFDI(this.props.navigation.state.params.updateData);
                    }
                });
                   
            }else{
                TimerMixin.setTimeout(() => {
                    this.setState({...err,spinnerVisible: false})
                }, 1000);
            }
        });
    }

    updateData(){
        let filtered = this.state.originalData.filter(item => {
            let itemDate=getDateFromLocaleFormat(formatLocaleDate(item.collectionDate));
            let passedFrom = true;
            let passedTo = true;
            if(this.from){
                passedFrom = itemDate.getTime() >= this.from.getTime();
            }
            if(this.to){
                passedTo = itemDate.getTime() <= this.to.getTime()
            }

            if(passedFrom && passedTo){
                return item;
            }

        });

        this.setState({ data: filtered});
    }

    setFrom(value){
        this.from = getDateFromLocaleFormat(value);
        this.updateData();

    }

    setTo(value){
        this.to = getDateFromLocaleFormat(value);
        this.updateData();
    }

    renderItem( { item } ) {
        return (
            <ListItem column borderDark >
                <Row style={sharedStyles.margin('bottom', 2)}>
                    <Left>
                        <Text sizeNormal heavy>{item.paymentNoteNumber}</Text>
                    </Left>
                </Row>

                <Row style={styles.listItemRow.self}>
                    <Left flex05 style={styles.listItemRow.left}>
                        <Text sizeNormal light style={styles.listItemRow.text}>{I18n.t('Amount')}:</Text>
                    </Left>
                    <Body>
                    <Text sizeNormal heavy>{item.collectionAmount}</Text>
                    </Body>
                </Row>

                <Row style={styles.listItemRow.self}>
                    <Left flex05 style={styles.listItemRow.left}>
                        <Text sizeNormal light style={styles.listItemRow.text}>{I18n.t('DATE')}:</Text>
                    </Left>
                    <Body>
                    <Text sizeNormal heavy>{( item.collectionDate ? formatLocaleDate(item.collectionDate) : '-')}</Text>
                    </Body>
                </Row>

                <Row style={styles.listItemRow.self}>
                    <Left flex05 style={styles.listItemRow.left}>
                        <Text sizeNormal light style={styles.listItemRow.text}>{I18n.t('METHOD')}:</Text>
                    </Left>
                    <Body>
                    <Text sizeNormal heavy>{item.paymentMethod}</Text>
                    </Body>
                </Row>

                <View style={{ position: 'absolute', bottom: 5, right: 5, width: 80 }}>
                    <Button primary style={{backgroundColor: platformStyle.brandPrimary,width: 80,alignItems:'center',justifyContent: 'center'}} onPress={this.createCFDI.bind(this, item)}>
                        <Text heavy small>{I18n.t('REQUEST_ELECTRONIC_BILL_BUTTON')}</Text>
                    </Button>
                </View>

            </ListItem>
        )
    }

  _keyExtractor = ( item, index ) => item.idOnlineCollection.toString();

  render() {
    return (
      <Container>
        <Header {...this.props} noDrawer
                iconAction={true}/>
          <SubHeader text={I18n.t('REQUEST_ELECTRONIC_BILL')} back {...this.props}/>        
          <PopupDialog
              refModal={this.state.messageAlert}
          />
        <Content>

            <Field name="fromDate"
                   component={FormPickerDate}
                   dataFormat={repo.configuration.getField("language") == "es" ? "DD/MM/YYYY" : "MM/DD/YYYY"}
                   label={I18n.t('FROM_DATE')}
                   onChange={(value) => {this.setFrom(value)}}
                   icon="md-calendar"
                   width={platformStyle.deviceWidth - 70}
                   errorActive
            />

            <Field name="toDate"
                   component={FormPickerDate}
                   dataFormat={repo.configuration.getField("language") == "es" ? "DD/MM/YYYY" : "MM/DD/YYYY"}
                   label={I18n.t('TO_DATE')}
                   onChange={(value) => {this.setTo(value)}}
                   icon="md-calendar"
                   width={platformStyle.deviceWidth - 70}
                   errorActive
            />
            <FlatList data={this.state.data}
                    style={sharedStyles.margin('bottom', 5)}
                    renderItem={this.renderItem.bind(this)}
                    keyExtractor={this._keyExtractor}
                    ListEmptyComponent={NoDataFound}
            />
        </Content>
        <Spinner visible={this.state.spinnerVisible} textContent={I18n.t('Loading')}
                 overlayColor={`rgba(0, 0, 0, 0.60)`}
                 textStyle={{ color: '#FFF' }}/>

      </Container>
    );
  }
}

const RequestElectronicBill = reduxForm({
    form: "RequestElectronicBillForm"
})(RequestElectronicBillScreen);

function bindAction( dispatch ) {
    return {};
}

const mapStateToProps = state => {
    return {
        initialValues: state.generalReducer.RequestElectronicBillForm,
    }
};

export default connect(mapStateToProps, bindAction)(RequestElectronicBill);
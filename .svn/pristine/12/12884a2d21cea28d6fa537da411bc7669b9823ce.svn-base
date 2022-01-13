import React, { Component } from "react";
import {
  Image,
  FlatList
} from "react-native";
import {
  Container,
  Text,
  Content,
  Row,
  ListItem,
  Left,
  Body,
  Button,
  View
} from "native-base";

import { Field, reduxForm } from "redux-form";

import Header from '../../../components/Header';
import {CurrencyText} from '../../../components/CurrencyText/'
import SubMenu from '../SubMenu';
import PopupDialog from '../../../components/PopupDialog/';
import DetailTabs from '../DetailTabs/';
import SummaryTabs from '../SummaryTabs/';
import I18n from 'react-native-i18n';
import styles from './styles';
import sharedStyles from '../../../shared/styles';
import {platformStyle} from "../../../theme";
import Numeral from "numeral";
import { connect } from 'react-redux';

import moment from 'moment-timezone';
import repo from '../../../services/database/repository';
import NoDataFound from '../../../components/NoDataFound/';
import generalService from "../../../services/general/generalService";
import {paymentRefreshed} from '../../../actions/general';

import Spinner from '../../../components/Spinner';
import firebaseService from "../../../services/firebase/firebaseService";
import Config from 'react-native-config';
import { formatLocaleDate } from '../../../shared/validations';

class AccountSummaryList extends Component {
  constructor( props ) {
    super(props);

    this.state = {
      data: [],
      spinnerVisible: false,
      indPrepayment: null,
      visible: false
    };

    this.showPopupAlert = this.showPopupAlert.bind(this);
  }

  componentDidMount() {
    firebaseService.supervisorAnalytic('BILLLIST');
    this.loadData();
  }

    loadData(){
        let isPrepWithTelecontrol = repo.configuration.getField("isPrepWithTelecontrol");
        let AdditionalData = JSON.parse(repo.configuration.getField('accountAdditionalData'));
        let data = AdditionalData.indPrepayment && !isPrepWithTelecontrol ? JSON.parse(repo.configuration.getField('recharges')) : JSON.parse(repo.configuration.getField('bills'));

        this.setState({
            indPrepayment: AdditionalData.indPrepayment,
            isPrepWithTelecontrol: isPrepWithTelecontrol,
            spinnerVisible: false,
            data
        });
    }

    componentWillReceiveProps( nextProps ) {
        if( this.props.paymentRefresh !== nextProps.paymentRefresh  ) {
            console.log("SummaryPayment -> paymentRefresh");
            let idPaymentForm = repo.configuration.getField('idPaymentForm');
            this.setState({ spinnerVisible: true });
            generalService.LoadDocumentsAction(idPaymentForm, ( err, result ) => {
                this.props.paymentRefreshed();
                if( !err ) {
                    this.loadData();
                }
            });
        }
    }


  showBill( idDocument ) {
	  
	    let endPoint = Config.ENDPOINT_PROD_POST_PDF;
		let API_URL = repo.configuration.getField('domain');
		let filename = `${idDocument}.pdf`;
		let URL_FINAL = `${endPoint}${idDocument}/pdf`;
		URL_FINAL = URL_FINAL.replace("{apiVersion}", repo.configuration.getField('apiVersion'));
		
		let TENANT = repo.configuration.getField('tenantId');
	    if(Config.IS_MULTITENANT === "true" && TENANT.length){
	    	URL_FINAL = "/t/" + TENANT + URL_FINAL;
	    }

        if(API_URL.substring(API_URL.length-1)=="/"){
            API_URL = API_URL.substring(0,API_URL.length-1);
        }

		URL_FINAL = API_URL + URL_FINAL;
	  
		this.props.navigation.navigate('ViewPDF',{
	      	downloadUrl: URL_FINAL,
	      	title: I18n.t('PREVIEW_PDF'),
	      	filename: filename
	    });
  }

  showConsumptionReport( idBill ) {
    let endPoint = Config.ENDPOINT_PROD_SERVICES;
    let API_URL = repo.configuration.getField('domain');
    let idContractedService = JSON.parse(repo.configuration.getField('serviceInfo')).idContractedService;

    let filename = `${idBill}.pdf`;
    let URL_FINAL = `${endPoint}${idContractedService}/bill/${idBill}/curveReport`;
    URL_FINAL = URL_FINAL.replace("{apiVersion}", repo.configuration.getField('apiVersion'));

    let TENANT = repo.configuration.getField('tenantId');
    if(Config.IS_MULTITENANT === "true" && TENANT.length){
      URL_FINAL = "/t/" + TENANT + URL_FINAL;
    }

    URL_FINAL = API_URL + URL_FINAL;

    this.props.navigation.navigate('ViewPDF',{
      downloadUrl: URL_FINAL,
      title: I18n.t('PREVIEW_PDF'),
      filename: filename
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


  renderItem( { item } ) {
    let timeZone = repo.configuration.getField("timeZone");
    if( this.state.indPrepayment && !this.state.isPrepWithTelecontrol ) {
      let dividedToken = '';
      if( item.tokenno ) {
        let token = item.tokenno;
        let divition = Math.ceil(token.length / 4);

        _.map(_.fill(new Array(divition), true), ( item, index ) => {
          if( index === divition - 1 ) dividedToken += token.substring(index * 4, token.length);
          else dividedToken += `${token.substring(index * 4, (index * 4) + 4)}-`;
        });
      }
      return (
        <ListItem column borderDark>
          <Row style={styles.listItemRow.self}>
            <Left flex04 style={styles.listItemRow.left}>
              <Text light style={styles.listItemRow.text}>{I18n.t('DATE')}</Text>
            </Left>
            <Body>
            <Text
              heavy>{( item.purchaseDate ? formatLocaleDate(item.purchaseDate) : '-')}</Text>
            </Body>
          </Row>


          <Row style={styles.listItemRow.self}>
            <Left flex04 style={styles.listItemRow.left}>
              <Text light style={styles.listItemRow.text}>{I18n.t('Amount')}</Text>
            </Left>
            <Body>
            	<CurrencyText heavy value={item.amount} />
            </Body>
          </Row>

          <Row style={styles.listItemRow.self}>
            <Left flex04 style={styles.listItemRow.left}>
              <Text light style={styles.listItemRow.text}>{I18n.t('UNITS')}</Text>
            </Left>
            <Body>
            <Text heavy>{Numeral(item.units).format("0,000.00")} {"kWh"}</Text>
            </Body>
          </Row>
          {dividedToken ?
          <Row style={styles.listItemRow.self}>
            <Left flex04 style={styles.listItemRow.left}>
              <Text light style={styles.listItemRow.text}>{I18n.t('Token_Number')}</Text>
            </Left>
            <Body>
            <Text heavy>{dividedToken}</Text>
            </Body>
          </Row> : null
          }


        </ListItem>
      )
    }
    else
      return (
        <ListItem column borderDark>
          <Row style={styles.listItemRow.self}>
            <Left flex04 style={styles.listItemRow.left}>
              <Text light style={styles.listItemRow.text}>{I18n.t('BILL_NUMBER')}</Text>
            </Left>
            <Body>
            <Text heavy>{item.billNumber}</Text>
            </Body>
          </Row>

          {item.emissionDate ?
              <Row style={styles.listItemRow.self}>
                <Left flex04 style={styles.listItemRow.left}>
                  <Text light style={styles.listItemRow.text}>{I18n.t('ISSUE_DATE_SHORT')}</Text>
                </Left>
                <Body>
                <Text heavy>{formatLocaleDate(item.emissionDate)}</Text>
                </Body>
              </Row>
              :null}

          <Row style={styles.listItemRow.self}>
            <Left flex04 style={styles.listItemRow.left}>
              <Text light style={styles.listItemRow.text}>{I18n.t('DUE_DATE')}</Text>
            </Left>
            <Body>
            <Text heavy>{( item.dueDate ? formatLocaleDate(item.dueDate) : '-')}</Text>
            </Body>
          </Row>

          <Row style={styles.listItemRow.self}>
            <Left flex04 style={styles.listItemRow.left}>
              <Text light style={styles.listItemRow.text}>{I18n.t('Amount')}</Text>
            </Left>
            <Body>
            	<CurrencyText heavy value={item.billAmount} />
            </Body>
          </Row>

          {item.fromDate ?
          <Row style={styles.listItemRow.self}>
            <Left flex04 style={styles.listItemRow.left}>
              <Text light style={styles.listItemRow.text}>{I18n.t('FROM_DATE')}</Text>
            </Left>
            <Body>
            <Text heavy>{formatLocaleDate(item.fromDate)}</Text>
            </Body>
          </Row>
          :null}

          {item.toDate ?
          <Row style={styles.listItemRow.self}>
            <Left flex04 style={styles.listItemRow.left}>
              <Text light style={styles.listItemRow.text}>{I18n.t('TO_DATE')}</Text>
            </Left>
            <Body>
            <Text heavy>{formatLocaleDate(item.toDate)}</Text>
            </Body>
          </Row>
          :null}

          <View style={{ position: 'absolute', bottom: 5, right: 0, width: 80 }}>
            <Button primary style={{backgroundColor: platformStyle.brandPrimary,width: 80,alignItems:'center',justifyContent: 'center'}} onPress={this.showBill.bind(this, item.idDocument)}>
              <Text heavy small>{I18n.t('BILL_DOWNLOAD')}</Text>
            </Button>
          </View>

          {this.state.isPrepWithTelecontrol ?
          <View style={{ position: 'absolute', bottom: 55, right: 0, width: 80 }}>
            <Button primary style={{backgroundColor: platformStyle.brandPrimary,width: 80,alignItems:'center',justifyContent: 'center'}} onPress={this.showConsumptionReport.bind(this, item.idBill)}>
              <Text heavy small>{I18n.t('REPORT_DOWNLOAD')}</Text>
            </Button>
          </View>
          :null}

        </ListItem>
      )
  }

  _keyExtractor = ( item, index ) => item.idDocument.toString();
  _keyExtractor2 = ( item, index ) => item.idBill.toString();

  render() {

    let { indPrepayment,isPrepWithTelecontrol } = this.state;
    let Bills = this.state.data;

    return (
      <Container>
        <PopupDialog
          refModal={this.state.messageAlert}
        />

        <Header noDrawer {...this.props}
                iconAction={'ios-home-outline'}/>
        <SubMenu title={I18n.t("ACCOUNT_SUMMARY")}  {...this.props}
                 indPrepayment={indPrepayment && !isPrepWithTelecontrol}/>

        <SummaryTabs {...this.props} indPrepayment={indPrepayment} isPrepWithTelecontrol={isPrepWithTelecontrol}/>

        <Content padder>
          {Bills && Bills.length ?
          <FlatList data={Bills}
                    style={sharedStyles.margin('bottom', 5)}
                    renderItem={this.renderItem.bind(this)}
                    keyExtractor={this.state.indPrepayment && !isPrepWithTelecontrol? this._keyExtractor2 : this._keyExtractor}
                    ListEmptyComponent={NoDataFound}
          />
          :null}
        </Content>
        <Spinner visible={this.state.spinnerVisible} textContent={I18n.t('Loading')}
                 overlayColor={`rgba(0, 0, 0, 0.60)`}
                 textStyle={{ color: '#FFF' }}/>
        <DetailTabs {...this.props} indPrepayment={indPrepayment && !isPrepWithTelecontrol}/>

      </Container>
    );
  }

}

// export default reduxForm({
//   form: "AccountSummaryListForm",
// })(AccountSummaryList);


const bindAction = dispatch => {
    return {
        paymentRefreshed: () => dispatch(paymentRefreshed()),
    };
};

const mapStateToProps = state => {
    return {
        paymentRefresh: state.generalReducer.paymentRefresh
    }
};


export default connect(mapStateToProps, bindAction)(AccountSummaryList);

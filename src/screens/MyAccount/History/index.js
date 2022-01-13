import React, { Component } from "react";
import { Image, FlatList, TouchableOpacity } from "react-native";
import { Button,Container,View, Text, Content, Row, ListItem, Left, Body } from "native-base";
import Config from 'react-native-config';

import { Field, reduxForm } from "redux-form";

import NoDataFound from '../../../components/NoDataFound/';
import Header from '../../../components/Header';
import DetailTabs from '../DetailTabs/index';
import I18n from 'react-native-i18n';
import styles from './styles';
import sharedStyles from '../../../shared/styles'
import SubMenu from '../SubMenu';
import moment from 'moment-timezone';
import generalService from "../../../services/general/generalService";
import waterfall from "async/waterfall";
import repo from '../../../services/database/repository'
import Spinner from '../../../components/Spinner';
import YellowSubHeader from '../../../components/YellowSubHeader/';
import PopupDialog from '../../../components/PopupDialog/';
import {CurrencyText} from '../../../components/CurrencyText/'
import firebaseService from "../../../services/firebase/firebaseService";
import TimerMixin from "react-timer-mixin";
import { formatLocaleDate } from '../../../shared/validations';

import {platformStyle} from "../../../theme";


class AccountHistory extends Component {
  constructor( props ) {
    super(props);

    this.state = {
      data: [],
      spinnerVisible: false,
    };

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

  componentDidMount() {

    firebaseService.supervisorAnalytic('STATEMENT');


    let idPaymentForm = repo.configuration.getField('idPaymentForm');

    waterfall([
      ( callback ) => {
        this.setState({ spinnerVisible: true });
        generalService.LoadAccountMovementsAction(idPaymentForm, callback);
      },
    ], ( err, result ) => {
      if( !err) {
        this.setState({ data: (result && result.data) ? result.data : null, spinnerVisible: false });
      } else {
        this.setState({ data: null, spinnerVisible: false });
        TimerMixin.setTimeout(() => {
          this.showPopupAlert("Error", I18n.t("NO_DATA"));
        }, 1000);
      }
    })
  }

  navigateStatement(){
    let API_URL = repo.configuration.getField('domain');
    let idPaymentForm = repo.configuration.getField('idPaymentForm');
    let ROUTE = Config.ENDPOINT_PROD_BALANCE.replace("{apiVersion}", repo.configuration.getField('apiVersion'));
    let DateTo = moment();
    let DateFrom = moment().subtract(360, 'days');
    let TENANT = repo.configuration.getField('tenantId');
    if(Config.IS_MULTITENANT === "true" && TENANT.length){
      ROUTE = "/t/" + TENANT + ROUTE;
    }

    if(API_URL.substring(API_URL.length-1)=="/"){
      API_URL = API_URL.substring(0,API_URL.length-1);
    }

    let url = `${API_URL}${ROUTE}?fromDate=${DateFrom}&idPaymentForm=${idPaymentForm}&toDate=${DateTo}`;

    this.props.navigation.navigate('ViewPDF',{
      downloadUrl: url,
      title: I18n.t('STATEMENT_PREV'),
      filename: idPaymentForm + ".pdf"
    })
  }

  renderItem( { item } ) {
    //if( item.typeEntry != 'TIPAPC0902' ) {
      return (
        <ListItem column borderDark>
          <TouchableOpacity style={sharedStyles.alignItems('start')}>
            <Row style={styles.listItemRow.self}>
              <Left flex08 style={styles.listItemRow.left}>
                <Text light style={styles.listItemRow.text}>{I18n.t('TRANS_TYPE')}</Text>
              </Left>
              <Body>
              <Text heavy>{item.nameType}</Text>
              </Body>
            </Row>

            <Row style={styles.listItemRow.self}>
              <Left flex08 style={styles.listItemRow.left}>
                <Text light style={styles.listItemRow.text}>{I18n.t('TRANS_DATE')}</Text>
              </Left>
              <Body>
              <Text
                heavy>{( item.dateEntry ? formatLocaleDate(item.dateEntry) : '-')}</Text>
              </Body>
            </Row>

            <Row style={styles.listItemRow.self}>
              <Left flex08 style={styles.listItemRow.left}>
                <Text light style={styles.listItemRow.text}>{I18n.t('Amount')}</Text>
              </Left>
              <Body>
              	<CurrencyText heavy value={item.amount} />
              </Body>
            </Row>

            <Row style={styles.listItemRow.self}>
              <Left flex08 style={styles.listItemRow.left}>
                <Text light style={styles.listItemRow.text}>{I18n.t('DEBT_BALANCE')}</Text>
              </Left>
              <Body>
              	<CurrencyText heavy value={item.debitBalance} />
              </Body>
            </Row>

            <Row style={styles.listItemRow.self}>
              <Left flex08 style={styles.listItemRow.left}>
                <Text light style={styles.listItemRow.text}>{I18n.t('CREDIT_BALANCE')}</Text>
              </Left>
              <Body>
              	<CurrencyText heavy value={item.creditBalance} />
              </Body>
            </Row>
          </TouchableOpacity>
        </ListItem>
      )
    //}
  }

  _keyExtractor = ( item, index ) => item.idEntry.toString();


  render() {

    let Movements = this.state.data;

    return (
      <Container>
        <Header noDrawer {...this.props} iconAction={'ios-home-outline'}/>
        <SubMenu title={I18n.t("TRANS_HISTORY")} {...this.props}/>
        {/**<YellowSubHeader text={I18n.t('TRANS_DETAILS')}/>**/}
        <View style={{height: 50, alignItems: 'center',justifyContent: 'center', backgroundColor: platformStyle.brandYellow}}>
          <Text black>{I18n.t("TRANS_DETAILS").toUpperCase()}</Text>
          <Text style={{ textDecorationLine: 'underline' }}
                onPress={() => this.navigateStatement()}>
            {"PDF"}
          </Text>
          {/**<Button roundedCircleSmall style={{backgroundColor: platformStyle.brandPrimary}} onPress={() => this.props.navigation.navigate('TermsConditions')}>
            <Text heavy small>PDF</Text>
          </Button>**/}
        </View>
        <PopupDialog
          refModal={this.state.messageAlert}
        />
        <Content padder>
          <FlatList data={Movements}
                    style={sharedStyles.margin('bottom', 5)}
                    renderItem={this.renderItem}
                    keyExtractor={this._keyExtractor}
                    ListEmptyComponent={NoDataFound}
          />
        </Content>
        <Spinner visible={this.state.spinnerVisible} textContent={I18n.t('Loading')}
                 overlayColor={`rgba(0, 0, 0, 0.60)`}
                 textStyle={{ color: '#FFF' }}/>
        <DetailTabs {...this.props} />
      </Container>
    );
  }
}

export default reduxForm({
  form: "AccountHistoryForm"
})(AccountHistory);

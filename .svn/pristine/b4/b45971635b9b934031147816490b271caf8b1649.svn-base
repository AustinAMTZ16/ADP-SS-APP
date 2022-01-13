import React, { Component } from "react";
import { Image, FlatList, TouchableOpacity,RefreshControl,TouchableHighlight } from 'react-native';
import { Text, View, Content, Container, Left, Body, ListItem, Row, Footer, FooterTab, Button,List,Right,Icon } from "native-base";
import { Field,reduxForm, formValueSelector } from "redux-form";
import { connect } from "react-redux";
import {CurrencyText,getCurrencie} from '../../../components/CurrencyText/'
import I18n from 'react-native-i18n';
import _ from 'lodash';
import Swiper from 'react-native-swiper';
import * as OpenAnything from 'react-native-openanything';

import NoDataFound from '../../../components/NoDataFound/';
import Header from '../../../components/Header';
import Checkbox from '../../../components/Checkbox/';
import StatusCircle from '../../../components/StatusCircle';
import SubHeader from '../../../components/SubHeader';
import SearchInput from '../../../components/SearchInput/';
import sharedStyles from '../../../shared/styles';
import styles from './styles'
import {platformStyle} from "../../../theme";
import ListTabs from '../ListTabs/';
import generalService from "../../../services/general/generalService";
import waterfall from "async/waterfall";
import repo from '../../../services/database/repository'

import Spinner from '../../../components/Spinner';
import DeviceInfo from "react-native-device-info/deviceinfo";
import firebaseService from "../../../services/firebase/firebaseService";
import PopupDialog from '../../../components/PopupDialog/';
import TimerMixin from "react-timer-mixin";
import BackButton from '../../../components/BackButton';
import Banner from '../../../components/Banner';
import ContractSubMenu from '../../ContractSubMenu';
import {createAlert} from '../../../components/ScreenUtils';
import linkContractService from "../../../services/general/linkContractService";


class MyAccountListPersonal extends Component {
  constructor( props ) {
    super(props);

    this.state = {
      isCorporate: true,
      spinnerVisible: false,
      parent: null,
      data: [],
      originalData: [],
      showActives:true,
      isRefreshing:false,
      reRender:null,
    };

    this.renderItem = this.renderItem.bind(this);
    this.search = this.search.bind(this);
  }

  componentDidMount() {
    firebaseService.supervisorAnalytic('PRIVATE');
    const { params } = this.props.navigation.state;

    this.setState({ spinnerVisible: true });
    
    //Restore selected accountNumber when focus this screen
    this.props.navigation.addListener(
    	    'willFocus', () => {
    	        repo.configuration.setField('accountNumber', null);
    	    }
    );

    //Makes a cache using internal DB
    let accountListAction = JSON.parse(repo.configuration.getField('accountListAction'));
    if( accountListAction.length) {
      this.setState({ data: accountListAction, originalData: accountListAction, spinnerVisible: false },
      //     function () {
      //   const {navigation } = this.props;
      //   TimerMixin.setTimeout(() => {
      //     navigation.navigate('ElectronicBill');
      //   }, 1000);
      // }
      );
    } else {
      this.loadData();
    }
    //var params2 = {"indPrepayment":false,"amount":"31.30","listBills":[{"emissionDate":1611874800000,"billAmount":31.3,"billPendAmount":31.3,"billNumber":"2021ROOTDC0000000356","dueDate":1613084400000,"idDocument":28503,"billList":[{"billAmount":31.3,"billToDate":1611874800000,"billConsum":0,"billFromDate":1611874800000,"billingType":"Off cycle","pending":1,"billNumber":"2021AP0000000239","serviceName":"Electricity","billPendAmount":31.3,"idBill":38419}],"isSelect":true}],"idPaymentForm":"2358"}
    //this.props.navigation.navigate('PaymentScreen',params2);
  }

  componentWillReceiveProps( nextProps ) {
    if( this.props.paymentRefresh !== nextProps.paymentRefresh  ) {     
      this.loadData();
    }
  }

  unlinkContractConfirmation() {
    if(this.isValidUnlink()){
          let options = {
              1: {
                  key: 'button1',
                  text: `${I18n.t('accept')}`,
                  action: () => this.unlinkContract(),
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
                  messageAlert: createAlert(I18n.t("INFO"), I18n.t("UNLINK_CONTRACT_CONFIRMATION") + repo.configuration.getField('accountNumberSelected'), options)
              });
          }, 500);
      }
  }

  isContractSelected(){
      //1. No contract Selected
      if(repo.configuration.getField('idPaymentFormSelected')==null){
          TimerMixin.setTimeout(() => {
              this.setState({
                  messageAlert: createAlert(I18n.t("INFO"), I18n.t("UNLINK_CONTRACT_NECESSARY"))
              });
          }, 500);
          return false;
      }
      return true;
  }

  isValidUnlink(){
      //1. No contract Selected
      if(!this.isContractSelected()){
          return false;
      }

      //2. Not possible to unlink because it is NOT Third Party
      if(repo.configuration.getField('accountNumberIndThirdParty')==false){
          TimerMixin.setTimeout(() => {
              this.setState({
                  messageAlert: createAlert(I18n.t("INFO"), I18n.t("UNLINK_CONTRACT_NOT_THIRD_PARTY"))
              });
          }, 500);
          return false;
      }
      return true;
  }

  unlinkContract() {
      waterfall([
          (callback) => {
              let req = {
                  "account": repo.configuration.getField('accountNumberSelected'),
                  "idCustomer":repo.configuration.getField('idCustomer')
              };
              linkContractService.unlink(req, callback);
          }
      ], function (err, result) {
          if (!err) {
              this.setState({
                  messageAlert: createAlert(I18n.t("INFO"), I18n.t("OPERATION_SUCCESS2"))
              });
              this.afterUnlinkContract();

          } else {
              TimerMixin.setTimeout(() => {
                  this.setState(err)
              }, 1000);
          }
      }.bind(this));
  }

  loadData(){
    let idCustomer = repo.configuration.getField('idCustomer');
    waterfall([
      ( callback ) => {
        generalService.AccountListAction(idCustomer, callback);
      }
    ], ( err, result ) => {
      if( !err ) {
        if( result.data ) {
          repo.configuration.setField('accountListAction', JSON.stringify(result.data));
          this.setState({ data: result.data, originalData: result.data, spinnerVisible: false,isRefreshing: false  });
        } else {
          this.setState({ data: null, originalData: null, spinnerVisible: false,isRefreshing: false  });
        }

      } else {
        this.setState({
          spinnerVisible: false,
          isRefreshing: false
        }, function() {
          TimerMixin.setTimeout(() => {
            this.showPopupAlert(I18n.t("INFO"), I18n.t("NETWORK_ERROR"));
          }, 1000);
        });
      }
    })
  }


  selectAccountAndService( item ) {
    this.setState({ spinnerVisible: true  });
    repo.configuration.setField('idPaymentForm', item.idPaymentForm.toString());
    repo.configuration.setField('accountNumber', item.accountNumber.toString());
	repo.configuration.setField('isoCode', item.isoCode.toString());
	repo.configuration.setField('idSector', item.idSector);
    let serviceInfo = {
      idContractedService:item.idContractedService,
      indPrepayment:item.indPrepayment
    };
    repo.configuration.setField('serviceInfo', JSON.stringify(serviceInfo));

    //Reset remaining balance JSON
    if(item.codServiceRateType=== '240TYSERRA'){
      repo.configuration.setField('remainingBalance', JSON.stringify({}));
    }

    TimerMixin.setTimeout(() => {
      this.setState({ spinnerVisible: false  });
      this.props.navigation.navigate('AccountSummaryPayment', { origin: true, codServiceRateType: item.codServiceRateType });
    }, 300);
  }

  search() {
    let data = _.cloneDeep(this.state.originalData);
    if( this.props.searchValue ) {
      data = _.filter(data, ( item ) => item.accountNumber.indexOf(this.props.searchValue) !== -1);
    }
    this.setState({ data });
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


  selectContract(item){
    repo.configuration.setField('accountNumberSelected',item.accountNumber);
    repo.configuration.setField('idPaymentFormSelected', item.idPaymentForm);
    repo.configuration.setField('accountNumberIndThirdParty',item.indThirdParty);
    this.setState({ reRender: new Date() });
  }


  renderItem( { item } ) {
    let ServiceList = item.lServices;

    ServiceList = _.map(ServiceList, function( item2 ) {
      item2.idPaymentForm = item.idPaymentForm;
      item2.accountNumber = item.accountNumber;
      item2.isoCode = 'USD';
      return item2;
    });
    
    //Balance color
    let balanceColor = "black";
    if(item.balance>0){
      balanceColor="green";
    }else if(item.balance<0){
      balanceColor="red";
    }

    //ContractSelected
    let sel = repo.configuration.getField('idPaymentFormSelected');
    let selected = item.idPaymentForm==sel;

    if (!(this.state.showActives && !item.indActive)){
      return (
        <ListItem column borderDark onPress={() => {this.selectContract(item)}}>
          {/* <StatusCircle icon="ios-pulse" active={item.indActive}/> */}

            <Row style={{ ...styles.listItemRow.self, ...sharedStyles.margin('top', 2)}}>
              <Left flex04 style={styles.listItemRow.left}>
                <Text sizeNormal light style={{...styles.listItemRow.text}}>{I18n.t('Account')}</Text>
              </Left>
              <Body>
              <Text sizeNormal heavy style={selected===true?{...styles.highLight}:null}>{item.accountNumber}</Text>
              </Body>
            </Row>

          {item.indThirdParty==true?
            <Row style={{ ...styles.listItemRow.self, ...sharedStyles.margin('top', 2)}}>
              <Left flex04 style={styles.listItemRow.left}>
                <Text sizeNormal light style={{...styles.listItemRow.text}}>{I18n.t('CustomerName')}</Text>
              </Left>
              <Body>
              <Text sizeNormal heavy>{item.customerName}</Text>
              </Body>
            </Row>:null}

            <Row style={styles.listItemRow.self}>
              <Left flex04 style={styles.listItemRow.left}>
                <Text sizeNormal light style={styles.listItemRow.text}>{I18n.t('Address')}</Text>
              </Left>
              <Body>
              <Text sizeNormal heavy>{item.completeAddress}</Text>
              </Body>
            </Row>

            <Row style={styles.listItemRow.self}>
              <Left flex04 style={styles.listItemRow.left}>
                <Text sizeNormal light style={styles.listItemRow.text}>{I18n.t('Status')}</Text>
              </Left>
              <Body>
              <Text sizeNormal heavy>{item.accountStatus}</Text>
              </Body>
            </Row>

            <Row style={styles.listItemRow.self}>
              <Left flex04 style={styles.listItemRow.left}>
                <Text sizeNormal light style={styles.listItemRow.text}>{I18n.t('Balance')}</Text>
              </Left>
              <Body>
              <CurrencyText sizeNormal heavy style={{color: balanceColor}} value={Math.abs(item.balance)} options={{isoCode: item.isoCode}}/>              
              </Body>
            </Row>


            <Row><Body><Text> </Text></Body></Row>

            <Row>
              <Body>
              <FlatList data={ServiceList}
                        renderItem={this.renderServiceItem.bind(this)}
                        keyExtractor={this._serviceKeyExtractor}
                        ListEmptyComponent={NoDataFound}
              />
              </Body>
            </Row>
        </ListItem>
      )
    } else return (<View/>)
  }
  _keyExtractor = ( item, index ) =>{
	  if(item.idPaymentForm){
		  return item.idPaymentForm.toString() + " - " + index;
	  }
	  return null
  }

  renderServiceItem( { item } ) {
      return (
          <ListItem noIndent onPress={() => {this.selectAccountAndService(item)}} style={{backgroundColor: "#f5f5f5"}}>
            {/*<TouchableOpacity style={{margin: 3, alignItems: 'flex-start', flexDirection:'column'}} onPress={() => this.selectAccountAndService(item)}>*/}
              <Row>
                  <Text sizeNormal heavy style={{color: platformStyle.brandPrimary, marginLeft: 10}}>{/*item.offerdService*/}Detalle del Servicio</Text>
                  <Text sizeNormal style={{color: platformStyle.brandPrimary, marginLeft: 10}}>{"(" + item.serviceStatus + ")"}</Text>
                  <Icon heavy name="arrow-forward" style={{ color: platformStyle.brandPrimary, marginLeft: 30, fontSize: 50 }} />
              </Row>
              {/*</TouchableOpacity>*/}
          </ListItem>
      )
  }
  _serviceKeyExtractor = ( item, index ) => item.idContractedService.toString();

  _onRefresh(){    
    repo.configuration.setField('bannerListCacheData',null);//WE SET OLD DATE IN ORDER TO REFRESH CACHE
    this.setState({ isRefreshing: true }, function() { this.loadData() });
  }

  afterUnlinkContract(){
    this.loadData();
  }

  linkContract(){  
    TimerMixin.setTimeout(() => {
      this.loadData();
    }, 3000);
  }

  render() {
    const Accounts = this.state.data;
    const routeName = this.props.navigation.state.routeName;
    let versionDevice = DeviceInfo.getVersion().toString();
    let heightObj = new Object();
    heightObj.height=25;
    const { showActives } = this.state;

    return (
      <Container>
        <BackButton/>
        <Header {...this.props}/>


        <ContractSubMenu title={I18n.t("MYACCOUNT")} {...this.props} unlinkContractConfirmation={this.unlinkContractConfirmation.bind(this)} onLinkContract={this.linkContract.bind(this)}/>

        {this.state.isCorporate ? <ListTabs {...this.props}/> : null}
        <PopupDialog
          refModal={this.state.messageAlert}
        />

        {this.state.originalData && this.state.originalData.length > 1 ?
            <View style={{
              ...sharedStyles.margin(true, 3),
              ...heightObj}}>
              <SearchInput placeholder={I18n.t("SEARCH_ACCOUNT")} onSubmit={this.props.handleSubmit(this.search)}/>
            </View> : null}
        
        <Content refreshControl={
                      <RefreshControl
                        refreshing={this.state.isRefreshing}
                        onRefresh={() => {this._onRefresh()}}
                      />
                    }
                 style={{...sharedStyles.margin(true, 3)}}
        >


          <Banner
              refreshing={this.state.isRefreshing}
              onNavigate={(screen,params) => {
                TimerMixin.setTimeout(() => {
                   this.props.navigation.navigate(screen,params);
                }, 500);
              }}
              
              onShowMessage={(message) => {  
                TimerMixin.setTimeout(() => {
                   this.setState(message);
                }, 500);
              }}
          />

          {this.state.originalData && this.state.data.length ?
              <View>
                <Text sizeNormal light style={styles.listItemRow.text}>
                  {I18n.t("SELECT_ACCOUNT_MSG")}
                </Text>
              </View> : null}

          <Checkbox style={{...sharedStyles.margin("bottom", 8)}}
                    onPress={() => this.setState({ showActives: !showActives })}
                    label={I18n.t('ACTIVE_CONTRACTS')}
                    checked={showActives}
          />

          <FlatList data={Accounts}
                    style={sharedStyles.margin('bottom', 5)}
                    renderItem={this.renderItem.bind(this)}
                    keyExtractor={this._keyExtractor}
                    ListEmptyComponent={NoDataFound}
          />

        </Content>
        <Spinner visible={this.state.spinnerVisible} textContent={I18n.t('Loading')}
                 overlayColor={`rgba(0, 0, 0, 0.60)`}
                 textStyle={{ color: '#FFF' }}/>

        <Footer noElevation style={styles.header}>
          <FooterTab style={{backgroundColor: platformStyle.brandPrimary}}>
            <Button onPress={() => this.props.navigation.navigate('About')}
                    style={{ paddingLeft: 0, paddingRight: 0 }}>
              <Text black={routeName === 'About' }>
                {I18n.t('ABOUT').toUpperCase()}
              </Text>
            </Button>

            <View style={{
              ...sharedStyles.divider('right'),
              ...sharedStyles.margin('vertical', 2)
            }}/>

            <Button onPress={() => this.props.navigation.navigate('Contact')}
                    style={{ paddingLeft: 0, paddingRight: 0 }}>
              <Text black={routeName === 'Contact'}>
                {I18n.t('CONTACT').toUpperCase()}
              </Text>
            </Button>

            <View style={{
              ...sharedStyles.divider('right'),
              ...sharedStyles.margin('vertical', 2)
            }}/>

            <Button onPress={() => this.props.navigation.navigate('Tips')}
                    style={{ paddingLeft: 0, paddingRight: 0 }}>
              <Text black={routeName === 'TIPS'}>
                {I18n.t('TIPS').toUpperCase()}
              </Text>
            </Button>
          </FooterTab>
        </Footer>
      </Container>
    );
  }
}

const MyAccountListPersonalForm = reduxForm({
  form: "MyAccountListPersonalForm"
})(MyAccountListPersonal);

const selector = formValueSelector('MyAccountListPersonalForm');
const mapStateToProps = state => {
  return {
    searchValue: selector(state, 'value'),
    paymentRefresh: state.generalReducer.paymentRefresh
  }
};

export default connect(mapStateToProps)(MyAccountListPersonalForm);

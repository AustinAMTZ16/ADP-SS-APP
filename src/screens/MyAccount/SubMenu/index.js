import React, { Component } from "react";
import { TouchableOpacity } from "react-native";
import { Icon, Text, Row, View, Left, Right, Body, Button } from "native-base";
import { NavigationActions } from 'react-navigation';
import DeviceInfo from "react-native-device-info/deviceinfo";

import subHeaderStyles from '../../../components/SubHeader/styles';
import I18n from 'react-native-i18n';
import styles from './styles';
import sharedStyles from '../../../shared/styles'
import IconFontello from '../../../components/IconFontello/';
import {platformStyle} from "../../../theme";
import {CurrencyText} from '../../../components/CurrencyText/'
import repo from '../../../services/database/repository'
import { connect } from 'react-redux';
import Config from 'react-native-config';
import moment from "moment";


const backAction = NavigationActions.back({
  key: null
});

class SubMenu extends Component {
  constructor( props ) {
    super(props);

    this.state = {
      spinnerVisible: false,
      menuOpen: false,
      infoOpen: false,
      data: null,
      services: null,
      AdditionalData: null,
      customer: {}
    };
  }

  componentDidMount() {
    this.loadData();
  }

  loadData() {
    let data = JSON.parse(repo.configuration.getField('accountDetail'));
    let services = JSON.parse(repo.configuration.getField('accountServices'));
    let AdditionalData = JSON.parse(repo.configuration.getField('accountAdditionalData'));
    let customer = JSON.parse(repo.configuration.getField('customerData'));
    let accountNumber = repo.configuration.getField('accountNumber');
    this.setState({ data, AdditionalData, services, customer, accountNumber });
  }

  componentWillReceiveProps( nextProps ) {
    if( this.props.reRender !== nextProps.reRender || this.props.reloadSubMenu !== nextProps.reloadSubMenu  ) {
      this.loadData();
    }
  }

    downloadPDF(){
        //1. Open PDF viewer
        let idPaymentForm = repo.configuration.getField('idPaymentForm');
        let endPoint = Config.ENDPOINT_ADP_PROGRAM;
        endPoint = `${endPoint}generateLetter?idPaymentForm=${idPaymentForm}`;
        let API_URL = repo.configuration.getField('domain');
        let filename = `${idPaymentForm}.pdf`;
        let TENANT = repo.configuration.getField('tenantId');
        if(Config.IS_MULTITENANT === "true" && TENANT.length){
            endPoint = "/t/" + TENANT + endPoint;
        }

        let URL_FINAL = API_URL+endPoint;
        URL_FINAL = URL_FINAL.replace("{apiVersion}", repo.configuration.getField('apiVersion'));

        this.props.navigation.navigate('ViewPDF',{
            downloadUrl: URL_FINAL,
            title: I18n.t('NO_DEBT_PROOF_TITLE'),
            filename: filename
        });
    }

  SelfReading() {

  }

  render() {

    const { leftIcon, noMenu, title, navigation } = this.props;

    let AccountDetail = this.state.data;
    let AdditionalData = this.state.AdditionalData;

    if( !AccountDetail ) {
      return (
        <View>
        </View>)
    }
    if( !AdditionalData ) {
      return (
        <View>
        </View>)
    }
    return (
      <View>
        {leftIcon ?
          <Row style={{...subHeaderStyles.subHeader.self, backgroundColor: platformStyle.brandPrimary}}>
            <Left flex02>
              <Button backButtom onPress={() => {
                navigation.dispatch(backAction)
              }}>
                <Icon name={leftIcon} style={subHeaderStyles.subHeader.backIcon}
                />
              </Button>
            </Left>
            <Body>
            <Text white heavy sizeNormal uppercase>{title}</Text>
            </Body>

            <Right flex02>
              {!noMenu ?
                <TouchableOpacity onPress={() => this.setState({ menuOpen: !this.state.menuOpen })}>
                  {this.state.menuOpen ?
                    <Icon name="ios-create" style={subHeaderStyles.subHeader.backIcon}/> :
                    <Icon name="ios-create-outline" style={subHeaderStyles.subHeader.backIcon}/> 
                  }
                </TouchableOpacity>
                : null
              }
            </Right>
          </Row>
          :
          <Row style={{ ...subHeaderStyles.subHeader.self, ...sharedStyles.padding('horizontal'), backgroundColor: platformStyle.brandPrimary }}>
            <Left>
              <Text white heavy sizeNormal uppercase>{title}</Text>
            </Left>
            <Right flex02>
              {!noMenu ?
                <Button menuSubHeader style={{ height: undefined, backgroundColor: platformStyle.brandPrimary }}
                        onPress={() => this.setState({ menuOpen: !this.state.menuOpen })}>
                  {this.state.menuOpen ?
                    <Icon name="ios-more-outline" style={subHeaderStyles.subHeader.menuIconSelected}/> :
                    <Icon name="ios-more" style={subHeaderStyles.subHeader.menuIconSelected}/>
                  }
                </Button> : null
              }
            </Right>
          </Row>
        }
        
        
        
        
        
        
        {this.state.menuOpen ?
          <View style={{...styles.menu.self, backgroundColor: platformStyle.brandPrimary}}>
           
       		{!this.props.indPrepayment && AdditionalData && AdditionalData.indMesurable && AdditionalData.indActive?
                <TouchableOpacity style={styles.menu.item}
                                  onPress={() => navigation.navigate('AddReading')}>
                  <View roundedCircleSmall style={{backgroundColor: platformStyle.brandYellow}}>
                    <IconFontello name="ebilling" size={15} style={{ color: platformStyle.brandPrimary }}/>
                  </View>
                  <Text white sizeNormal> {I18n.t("ADD_READING")}</Text>
                </TouchableOpacity> : null}


            {!this.props.indPrepayment && AdditionalData && AdditionalData.indActive ?
              <TouchableOpacity style={styles.menu.item}
                                onPress={() => navigation.navigate('AccountRequestEBilling')}>
                <View roundedCircleSmall style={{backgroundColor: platformStyle.brandYellow}}>
                  <IconFontello name="ebilling" size={15} style={{ color: platformStyle.brandPrimary }}/>
                </View>
                <Text white sizeNormal> {I18n.t("REQUEST_EBILLING")}</Text>
              </TouchableOpacity> : null}
            
            
            <TouchableOpacity style={styles.menu.item}
                              onPress={() => navigation.navigate('ComplaintsSuggestionsList')}>
              <View roundedCircleSmall style={{backgroundColor: platformStyle.brandYellow}}>
                <IconFontello name="complain" size={18} style={{ color: platformStyle.brandPrimary }}/>
              </View>
              <Text white sizeNormal> {I18n.t('RCCS')}</Text>
            </TouchableOpacity>
           
	        <TouchableOpacity style={styles.menu.item}
	                              onPress={() => navigation.navigate('Outages')}>
	              <View roundedCircleSmall style={{backgroundColor: platformStyle.brandYellow}}>
	                <IconFontello name="outages" size={15} style={{ color: platformStyle.brandPrimary }}/>
	              </View>
	              <Text white sizeNormal> {I18n.t('ReportOutages')}</Text>
	        </TouchableOpacity>


            {!AdditionalData.indPrepayment ?
	        <TouchableOpacity style={styles.menu.item}
	                              onPress={() => navigation.navigate('PayBills')}>
	              <View roundedCircleSmall style={{backgroundColor: platformStyle.brandYellow}}>
	                <IconFontello name="bill" size={15} style={{ color: platformStyle.brandPrimary }}/>
	              </View>
	              <Text white sizeNormal> {I18n.t('PAY_BILLS')}</Text>
	        </TouchableOpacity>
	        :
		    <TouchableOpacity style={styles.menu.item}
	            onPress={() => navigation.navigate('TopUp')}>
	            <View roundedCircleSmall style={{backgroundColor: platformStyle.brandYellow}}>
	                <IconFontello name="bill" size={15} style={{ color: platformStyle.brandPrimary }}/>
	            </View>
	            <Text white sizeNormal> {I18n.t('TOP_UP')}</Text>
	        </TouchableOpacity>
            }
              <TouchableOpacity style={styles.menu.item}
                                onPress={() => navigation.navigate('ElectronicBill')}>
                  <View roundedCircleSmall style={{backgroundColor: platformStyle.brandYellow}}>
                      <IconFontello name="ebilling" size={15} style={{ color: platformStyle.brandPrimary }}/>
                  </View>
                  <Text white sizeNormal> {I18n.t('ELECTRONIC_BILL')}</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.menu.item}
                                onPress={() => navigation.navigate('AnnualFolioScreen')}>
                  <View roundedCircleSmall style={{backgroundColor: platformStyle.brandYellow}}>
                      <IconFontello name="jua" size={15} style={{ color: platformStyle.brandPrimary }}/>
                  </View>
                  <Text white sizeNormal> {I18n.t('ANNUAL_FOLIO_CONSULTATION')}</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.menu.item}
                                onPress={() => navigation.navigate('NoDebtProofScreen')}>
                  <View roundedCircleSmall style={{backgroundColor: platformStyle.brandYellow}}>
                      <IconFontello name="ebilling" size={15} style={{ color: platformStyle.brandPrimary }}/>
                  </View>
                  <Text white sizeNormal> {I18n.t('NO_DEBT_PROOF_TITLE')}</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.menu.item}
                                onPress={() => {this.downloadPDF()}}>
                  <View roundedCircleSmall style={{backgroundColor: platformStyle.brandYellow}}>
                      <IconFontello name="ebilling" size={15} style={{ color: platformStyle.brandPrimary }}/>
                  </View>
                  <Text white sizeNormal> {I18n.t('NO_DEBT_PROOF_PDF_TITLE')}</Text>
              </TouchableOpacity>
	        
          </View>
          : null
        }

        {(!this.state.menuOpen && AccountDetail) ?
          <View style={sharedStyles.padding('vertical', 2)}>
            <Row style={styles.accountInfo.item}>
              <Left flex04 style={styles.accountInfo.left}>
                <Text sizeNormal light style={styles.accountInfo.text}>{I18n.t('AccountN')}</Text>
              </Left>

              <Body style={{ ...sharedStyles.alignItems('start'), ...sharedStyles.alignSelf('start'), }}>
              <Row>
                <Body style={{ ...sharedStyles.alignItems('start'), ...sharedStyles.alignSelf('start'), }}>
                <Text sizeNormal
                      heavy>{(this.state.accountNumber ? this.state.accountNumber : '-')}</Text>
                </Body>
                <Right style={{ height: 25, flexDirection: 'row', justifyContent: 'flex-end', alignItems:'center' }}>
                  {DeviceInfo.getCarrier() === 'Safaricom' && AdditionalData &&
                  <Button small rounded style={{backgroundColor: platformStyle.brandPrimary}} onPress={() => navigation.navigate( 'AccountPayment' )}>
                    <Text sizeNormal> {I18n.t( AdditionalData.indPrepayment ? 'Buy' : 'Pay' )}</Text>
                  </Button>
                  }
                  <TouchableOpacity style={sharedStyles.padding('horizontal', 3)}
                                    onPress={() => this.setState({ infoOpen: !this.state.infoOpen })}>
                    <IconFontello name={this.state.infoOpen ? 'minus' : 'plus'} style={{...styles.accountInfo.toggleIcon, color: platformStyle.brandSecondary}} size={25}/>
                  </TouchableOpacity>
                </Right>
              </Row>
              </Body>
            </Row>

            <Row style={{height: 'auto'}}>
              <Left flex04 style={styles.accountInfo.left}>
                <Text sizeNormal light style={styles.accountInfo.text}>{I18n.t('Balance')}</Text>
              </Left>
              <Body style={sharedStyles.alignItems('start')}>
              	<CurrencyText heavy sizeNormal value={AccountDetail.contractData && AccountDetail.contractData.balance ? Math.abs(AccountDetail.contractData.balance) : "0"}>         
	  				{(AccountDetail.contractData && AccountDetail.contractData.balance && AccountDetail.contractData.balance > 0 ) ? I18n.t('OVER_PAYMENT') : ""}
	            </CurrencyText>
              </Body>
            </Row>

            
            
            
            
            {(this.state.infoOpen && AccountDetail && AccountDetail) ?
              <View>
                <Row style={{...styles.accountInfo.item, ...sharedStyles.margin('top', 1)}}>
                  <Left flex04 style={styles.accountInfo.left}>
                    <Text sizeNormal light style={styles.accountInfo.text}>{I18n.t('CUSTOMER')}</Text>
                  </Left>
                  <Body style={sharedStyles.alignItems('start')}>
                  <Text sizeNormal
                        heavy>{this.state.customer.fullName ? this.state.customer.fullName : '-'}</Text>
                  </Body>
                </Row>

                <Row style={styles.accountInfo.item}>
                  <Left flex04 style={styles.accountInfo.left}>
                    <Text sizeNormal light style={styles.accountInfo.text}>{I18n.t('Address')}</Text>
                  </Left>
                  <Body style={sharedStyles.alignItems('start')}>
                  <Text sizeNormal
                        heavy>{(AccountDetail.contractAddress && AccountDetail.contractAddress.completeAddress ? AccountDetail.contractAddress.completeAddress : '-')}</Text>
                  </Body>
                </Row>

                <Row style={styles.accountInfo.item}>
                  <Left flex04 style={styles.accountInfo.left}>
                    <Text sizeNormal light style={styles.accountInfo.text}>{I18n.t('Service')}</Text>
                  </Left>
                  <Body style={sharedStyles.alignItems('start')}>
                  <Text sizeNormal
                        heavy>{AdditionalData.descType}</Text>
                  </Body>
                </Row>

                <Row style={styles.accountInfo.item}>
                  <Left flex04 style={styles.accountInfo.left}>
                    <Text sizeNormal light style={styles.accountInfo.text}>{I18n.t('MODE')}</Text>
                  </Left>
                  <Body style={sharedStyles.alignItems('start')}>
                  <Text sizeNormal
                        heavy>{(AccountDetail && AdditionalData.indPrepayment ? I18n.t('Prepaid') : I18n.t('Postpaid') )}</Text>
                  </Body>
                </Row>

                {AccountDetail && AdditionalData.indPrepayment ?
                  <Row style={styles.accountInfo.item}>
                    <Left flex04 style={styles.accountInfo.left}>
                      <Text sizeNormal light style={styles.accountInfo.text}>{I18n.t('PENDING_BILL')}</Text>
                    </Left>
                    <Body style={sharedStyles.alignItems('start')}>
                    <Text sizeNormal heavy>{(AdditionalData.pendingBills ? AdditionalData.pendingBills : '0')}</Text>
                    </Body>
                  </Row> : null}

                <Row style={styles.accountInfo.item}>
                  <Left flex04 style={styles.accountInfo.left}>
                    <Text sizeNormal light style={styles.accountInfo.text}>{I18n.t('ACTIVE')}</Text>
                  </Left>
                  <Body style={sharedStyles.alignItems('start')}>
                  <Text sizeNormal heavy>{(AdditionalData.indActive ? I18n.t('YES') : "NO")}</Text>
                  </Body>
                </Row>
              </View> : null}
          </View>
          : null
        }

      </View>
    );


  }
}

function bindAction( dispatch ) {
  return {

  };
}

const mapStateToProps = state => {
  return {
    reloadSubMenu: state.generalReducer.reloadSubMenu
  }
};

export default connect(mapStateToProps, bindAction)(SubMenu);

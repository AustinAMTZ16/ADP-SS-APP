import React, { Component } from "react";
import { Image, FlatList, TouchableOpacity,RefreshControl } from 'react-native';
import { Text, View, Content, Container, Left, Body, ListItem, Row, Footer, FooterTab, Button,List,Right,Icon } from "native-base";
import { Field,reduxForm, formValueSelector } from "redux-form";
import { connect } from "react-redux";
import {CurrencyText,getCurrencie} from '../../components/CurrencyText/'
import I18n from 'react-native-i18n';
import _ from 'lodash';
import moment from 'moment-timezone';

import NoDataFound from '../../components/NoDataFound/';
import Header from '../../components/Header';
import SubHeader from '../../components/SubHeader';
import sharedStyles from '../../shared/styles';
import styles from './styles'
import {platformStyle} from "../../theme";
import generalService from "../../services/general/generalService";
import waterfall from "async/waterfall";
import repo from '../../services/database/repository'

import Spinner from '../../components/Spinner';
import PopupDialog from '../../components/PopupDialog/';
import TimerMixin from "react-timer-mixin";
import BackButton from '../../components/BackButton';
import { formatLocaleDate } from '../../shared/validations';


class OtherAccounts extends Component {
  constructor( props ) {
    super(props);

    this.state = {
      isCorporate: true,
      spinnerVisible: false,
      parent: null,
      data: [],
      originalData: [],
      showActives:true,
      isRefreshing:false
    };

    this.renderItem = this.renderItem.bind(this);
  }

  componentDidMount() {
    this.loadData();
  }

  loadData(){
    this.setState({
      spinnerVisible: true
    });
    waterfall([
      (callback ) => {
        let idCustomer = repo.configuration.getField('idCustomer');
        generalService.getOtherAccounts(idCustomer, callback);
      }
    ], ( err, result ) => {
      if(!err){
        if(result && result.length>0){
          this.setState({
            spinnerVisible: false,
            data: result
          });
        } else {
          this.setState({ data: null, spinnerVisible: false});
        }
      }else{
        this.setState({ spinnerVisible: false }, function() {
          TimerMixin.setTimeout(() => {
            this.setState(err)
          }, 1000);
        }.bind(this));
      }
    });
  }


  renderItem( { item } ) {    
    //Balance color
    let balanceColor = "black";
    if(item.balance>0){
      balanceColor="green";
    }else if(item.balance<0){
      balanceColor="red";
    }

    if (this.state.data){
      return (
        <ListItem column borderDark>
            <Row style={{ ...styles.listItemRow.self, ...sharedStyles.margin('top', 2) }}>
              <Left flex05 style={styles.listItemRow.left}>
                <Text sizeNormal light style={styles.listItemRow.text}>{I18n.t('Account')}</Text>
              </Left>
              <Body>
              <Text sizeNormal heavy>{item.accountNumber}</Text>
              </Body>
            </Row>

            <Row style={styles.listItemRow.self}>
              <Left flex05 style={styles.listItemRow.left}>
                <Text sizeNormal light style={styles.listItemRow.text}>{I18n.t('Address')}</Text>
              </Left>
              <Body>
              <Text sizeNormal heavy>{item.completeAddress}</Text>
              </Body>
            </Row>

            <Row style={styles.listItemRow.self}>
              <Left flex05 style={styles.listItemRow.left}>
                <Text sizeNormal light style={styles.listItemRow.text}>{I18n.t('Balance')}</Text>
              </Left>
              <Body>
              <CurrencyText sizeNormal heavy style={{color: balanceColor}} value={item.balance} options={{isoCode: item.isoCode}}/>
              </Body>
            </Row>

            <Row style={styles.listItemRow.self}>
              <Left flex05 style={styles.listItemRow.left}>
                <Text sizeNormal light style={styles.listItemRow.text}>{I18n.t('LAST_BILL')}</Text>
              </Left>
              <Body>
              <Text sizeNormal heavy>{(item.dateLastBill ? formatLocaleDate(item.dateLastBill) : '-')}</Text>
              </Body>
            </Row>
        </ListItem>
      )
    } else return (<View/>)
  }
  _keyExtractor = ( item, index ) => item.idPaymentForm.toString();

  render() {
    return (
      <Container>
        <BackButton/>
        <Header {...this.props}/>
        <SubHeader text={I18n.t('OTHER_ACCOUNTS')} back={true}
            {...this.props}
        />
        <PopupDialog refModal={this.state.messageAlert}/>
        <Content>
          {this.state.data && this.state.data.length>0 ?
              <View>
                <Text sizeNormal light style={styles.listItemRow.text}>
                  {I18n.t("OTHER_ACCOUNTS_MESSAGE")}
                </Text>
              </View> : null}
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

const mapStateToProps = state => ({});

export default connect(mapStateToProps)(OtherAccounts);

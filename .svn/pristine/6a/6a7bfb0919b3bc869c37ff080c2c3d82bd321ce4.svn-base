import React, { Component } from "react";
import { TouchableOpacity, FlatList } from 'react-native';
import {
  Text,
  Content,
  Container,
  View,
  Row,
  Left,
  Body,
  ListItem
} from "native-base";
import I18n from 'react-native-i18n';
import { Field, reduxForm } from "redux-form";

import NoDataFound from '../../../components/NoDataFound/';
import {CurrencyText} from '../../../components/CurrencyText/'
import Header from '../../../components/Header';
import SubHeader from '../../../components/SubHeader';
import sharedStyles from '../../../shared/styles';
import styles from './styles'
import {platformStyle} from "../../../theme";
import repo from '../../../services/database/repository'
import StatusCircle from '../../../components/StatusCircle';
import PopupDialog from '../../../components/PopupDialog/';

class HolderRequestChange extends Component {
  constructor( props ) {
    super(props);

    this.state = {
      filter: 'account',
      submitted: false,
      data: [],
    };

  }

  loadData() {
    let accountListAction = JSON.parse(repo.configuration.getField('accountListAction'));
    this.setState({ data: accountListAction });
  }

  selectAccount( account ) {
    this.showPopupAlert(I18n.t("INFO"), I18n.t("SELECT_ACCOUNT").replace("{accountNumber}", account.accountNumber),
      {
        1: {
          key: 'button1',
          text: `${I18n.t('accept')}`,
          action: () => this.enterToAccount(account),
          align: ''
        },
        2: {
          key: 'button2',
          text: `${I18n.t('Cancel')}`,
          align: ''
        }
      });
  }

  enterToAccount( account ) {
    repo.configuration.setField('idPaymentForm', account.idPaymentForm.toString());
    this.props.navigation.navigate( 'HolderRequestCorrespondence' );
  }

  componentDidMount() {
    this.loadData();
  }


  /**
   * POPUP
   * @param title
   * @param text
   * @param options
   */
  showPopupAlert( title, text, options, content ) {
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
    return (
      <ListItem column borderDark>
        <TouchableOpacity onPress={() => this.selectAccount(item)}
                          style={sharedStyles.alignItems('start')}>
          <StatusCircle icon="ios-pulse" active={item.indActive}/>

          <Row style={{ ...styles.listItemRow.self, ...sharedStyles.margin('top', 2) }}>
            <Left flex04 style={styles.listItemRow.left}>
              <Text sizeNormal light style={styles.listItemRow.text}>{I18n.t('Account')} #</Text>
            </Left>
            <Body>
            <Text sizeNormal heavy style={{...styles.listItemRow.accountText, color: platformStyle.brandPrimary}}>{item.accountNumber}</Text>
            </Body>
          </Row>

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
              <Text sizeNormal light style={styles.listItemRow.text}>{I18n.t('Service')}</Text>
            </Left>
            <Body>
            <Text sizeNormal heavy>{(item.indPrepayment ? I18n.t('Prepaid') : I18n.t('Postpaid') )}</Text>
            </Body>
          </Row>

          <Row style={styles.listItemRow.self}>
            <Left flex04 style={styles.listItemRow.left}>
              <Text sizeNormal light style={styles.listItemRow.text}>{I18n.t('Meter')}</Text>
            </Left>
            <Body>
            <Text sizeNormal heavy>{( item.serialNumber ? item.serialNumber.join(', ') : '-')}</Text>
            </Body>
          </Row>

          <Row style={styles.listItemRow.self}>
            <Left flex04 style={styles.listItemRow.left}>
              <Text sizeNormal light style={styles.listItemRow.text}>{I18n.t('Balance')}</Text>
            </Left>
            <Body>
            	<CurrencyText heavy sizeNormal value={item.balance.replace("-", "")}>
	            	{(item.balance > 0 ) ? I18n.t('Over_Payment') : ""}
				</CurrencyText>
            </Body>
          </Row>

        </TouchableOpacity>
      </ListItem>
    )
  }

  _keyExtractor = ( item, index ) => item.idPaymentForm.toString();

  render() {
    const Accounts = this.state.data;
    return (
      <Container>
        <Header {...this.props} noDrawer/>
        <SubHeader back text={I18n.t('Change_Account_Holder')} {...this.props}/>
        <PopupDialog
          refModal={this.state.messageAlert}
        />
        <Content>
          <View padder>
            <Text sizeNormal light style={styles.listItemRow.text}>
              Select one of the Accounts to change holder.
            </Text>
          </View>
          <FlatList data={Accounts}
                    style={sharedStyles.margin('bottom', 5)}
                    renderItem={this.renderItem.bind(this)}
                    keyExtractor={this._keyExtractor}
                    ListEmptyComponent={NoDataFound}
          />
        </Content>
      </Container>
    );
  }
}

export default reduxForm({
  form: "HolderRequestSearchForm"
})(HolderRequestChange);

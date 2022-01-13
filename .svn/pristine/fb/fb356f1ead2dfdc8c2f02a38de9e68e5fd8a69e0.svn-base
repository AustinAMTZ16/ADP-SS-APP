import React, {Component} from "react";
import {Image, FlatList, TouchableOpacity} from 'react-native';
import {Text, View, Content, Container, Left, Body, ListItem, Row, Icon} from "native-base";
import {reduxForm} from "redux-form";
import I18n from 'react-native-i18n';

import NoDataFound from '../../../components/NoDataFound/';
import Header from '../../../components/Header';
import SubHeader from '../../../components/SubHeader';
import StatusCircle from '../../../components/StatusCircle';
import SearchInput from '../../../components/SearchInput';
import sharedStyles from '../../../shared/styles';
import styles from './styles'
import {platformStyle} from "../../../theme";
import firebaseService from "../../../services/firebase/firebaseService";


class CorporateAccounts extends Component {
  constructor( props ) {
    super( props );

    this.renderItem = this.renderItem.bind( this );
  }

  componentDidMount() {
    firebaseService.supervisorAnalytic('CORPORATE');
  }
  renderItem( { item } ) {
    return (
      <ListItem column borderDark>
        <TouchableOpacity onPress={() => this.props.navigation.navigate('AccountSummaryPayment')}
                          style={sharedStyles.alignItems('start')}>
          <StatusCircle icon="ios-pulse" active={item.t}/>

          <Row style={{ ...styles.listItemRow.self, ...sharedStyles.margin('top', 2) }}>
            <Left flex04 style={styles.listItemRow.left}>
              <Text sizeNormal light style={styles.listItemRow.text}>{I18n.t( 'Account' )} #</Text>
            </Left>
            <Body>
            <Text sizeNormal heavy style={{...styles.listItemRow.accountText, color: platformStyle.brandPrimary}}>25232497</Text>
            </Body>
          </Row>

          <Row style={styles.listItemRow.self}>
            <Left flex04 style={styles.listItemRow.left}>
              <Text sizeNormal light style={styles.listItemRow.text}>{I18n.t( 'Address' )}</Text>
            </Left>
            <Body>
            <Text sizeNormal heavy>445 Mount Eden Road, Mount Eden, Auckland.</Text>
            </Body>
          </Row>

          <Row style={styles.listItemRow.self}>
            <Left flex04 style={styles.listItemRow.left}>
              <Text sizeNormal light style={styles.listItemRow.text}>{I18n.t( 'Service' )}</Text>
            </Left>
            <Body>
            <Text sizeNormal heavy>{I18n.t( 'Postpaid' )}</Text>
            </Body>
          </Row>

          <Row style={styles.listItemRow.self}>
            <Left flex04 style={styles.listItemRow.left}>
              <Text sizeNormal light style={styles.listItemRow.text}>{I18n.t( 'Meter' )}</Text>
            </Left>
            <Body>
            <Text sizeNormal heavy>06345532</Text>
            </Body>
          </Row>

          <Row style={styles.listItemRow.self}>
            <Left flex04 style={styles.listItemRow.left}>
              <Text sizeNormal light style={styles.listItemRow.text}>{I18n.t( 'Balance' )}</Text>
            </Left>
            <Body>
            <Text sizeNormal heavy>2.200,00</Text>
            </Body>
          </Row>

        </TouchableOpacity>
      </ListItem>
    )
  }

  render() {
    return (
      <Container>
        <Header {...this.props} noDrawer iconAction={'ios-home-outline'}/>
        <SubHeader text={I18n.t('My Corporate Accounts')} back
                   menu={{
                     icon: 'ios-list-outline', isOpened: true,
                     items:
                      <TouchableOpacity style={styles.menu.item}
                        onPress={() => this.props.navigation.navigate('AccountSummaryLetter')}>
                        <Icon name="ios-list-outline" style={styles.menu.icon}/>
                        <Text white sizeNormal>{I18n.t('Summary Letter')}</Text>
                      </TouchableOpacity>
                   }} {...this.props} />

        <Content padder>
          <View style={sharedStyles.margin(true, 3)}>
            <SearchInput onSubmit={this.props.handleSubmit(() => {})}/>
          </View>

          <FlatList data={[ { key: 'a', t: true }, { key: 'b', t: false }, { key: 'c', t: true } ]}
                    style={sharedStyles.margin('bottom', 5)}
                    renderItem={this.renderItem}
                    ListEmptyComponent={NoDataFound}
          />
        </Content>
      </Container>
    );
  }
}


export default reduxForm( {
  form: "MyAccountCorporateAccountsForm"
} )( CorporateAccounts );

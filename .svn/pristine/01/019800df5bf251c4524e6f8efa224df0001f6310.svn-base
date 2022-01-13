import React, {Component} from "react";
import {Image, FlatList, TouchableOpacity} from 'react-native';
import {Text, Content, Container, Left, Body, ListItem, Row, View} from "native-base";
import {reduxForm} from "redux-form";
import I18n from 'react-native-i18n';

import NoDataFound from '../../../components/NoDataFound/';
import Header from '../../../components/Header';
import SubHeader from '../../../components/SubHeader';
import SearchInput from '../../../components/SearchInput';
import StatusCircle from '../../../components/StatusCircle';
import sharedStyles from '../../../shared/styles';
import ListTabs from '../ListTabs/';
import styles from './styles'
import {platformStyle} from "../../../theme";


class MyAccountListCorporate extends Component {
  constructor( props ) {
    super( props );

    this.renderItem = this.renderItem.bind( this );
  }

  renderItem( { item } ) {
    return (
      <ListItem column borderDark>
        <TouchableOpacity onPress={() => this.props.navigation.navigate('AccountCorporateAccounts')}
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
              <Text sizeNormal light style={styles.listItemRow.text}>{I18n.t( 'Payment Method' )}</Text>
            </Left>
            <Body>
            <Text sizeNormal heavy>Normal</Text>
            </Body>
          </Row>

          <Row style={styles.listItemRow.self}>
            <Left flex04 style={styles.listItemRow.left}>
              <Text sizeNormal light style={styles.listItemRow.text}>{I18n.t( 'Send Date' )}</Text>
            </Left>
            <Body>
            <Text sizeNormal heavy>01/01/2000</Text>
            </Body>
          </Row>

          <Row style={styles.listItemRow.self}>
            <Left flex04 style={styles.listItemRow.left}>
              <Text sizeNormal light style={styles.listItemRow.text}>{I18n.t( 'Next Sending Date' )}</Text>
            </Left>
            <Body>
            <Text sizeNormal heavy>05/03/2018</Text>
            </Body>
          </Row>

          <Row style={styles.listItemRow.self}>
            <Left flex04 style={styles.listItemRow.left}>
              <Text sizeNormal light style={styles.listItemRow.text}>{I18n.t( 'No. Linked Accounts' )}</Text>
            </Left>
            <Body>
            <Text sizeNormal heavy>0</Text>
            </Body>
          </Row>

          <Row style={styles.listItemRow.self}>
            <Left flex04 style={styles.listItemRow.left}>
              <Text sizeNormal light style={styles.listItemRow.text}>{I18n.t( 'Balance' )}</Text>
            </Left>
            <Body>
            <Text sizeNormal heavy>0.00</Text>
            </Body>
          </Row>

        </TouchableOpacity>
      </ListItem>
    )
  }

  render() {
    return (
      <Container>
        <Header {...this.props}/>
        <SubHeader text={I18n.t('MYACCOUNT')}/>
        <ListTabs {...this.props}/>

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
  form: "MyAccountListCorporateForm"
} )( MyAccountListCorporate );

import React, {Component} from "react";
import {TouchableOpacity, FlatList} from 'react-native';
import {Text, Content, Container, Left, Body, ListItem, Row} from "native-base";
import I18n from 'react-native-i18n';
import Numeral from "numeral";
import {NavigationActions} from 'react-navigation';
import { connect } from 'react-redux';

import { selectAccount } from '../../../actions/general';
import SubHeader from '../../../components/SubHeader';
import StatusCircle from '../../../components/StatusCircle';
import sharedStyles from '../../../shared/styles';
import styles from './styles'
import repo from '../../../services/database/repository'
import NoDataFound from '../../../components/NoDataFound/';

const backAction = NavigationActions.back( {
  key: null
} );

class Accounts extends Component {
  constructor( props ) {
    super( props );
    this.state = {
      accounts: []
    };

    this.renderItem = this.renderItem.bind( this );
  }

  componentDidMount() {
    this.setState( { accounts: JSON.parse( repo.configuration.getField( 'accountListAction' ) ) } )
  }

  renderItem( { item } ) {
	const type = this.props.navigation.getParam('type', 0);
	const description = this.props.navigation.getParam('description', "");
	if(type)item.type = type;
	if(description)item.description = description;

    return (
      <ListItem column borderDark>
        <TouchableOpacity style={sharedStyles.alignItems('start')}
                          onPress={() => {
                            this.props.selectAccount(item);
                            this.props.navigation.dispatch(backAction);
                          }}>
          <StatusCircle icon="ios-pulse" active={item.t}/>

          <Row style={styles.listItemRow.self}>
            <Left flex04 style={styles.listItemRow.left}>
              <Text sizeNormal light style={styles.listItemRow.text}>{I18n.t( 'Account' )}</Text>
            </Left>
            <Body>
            <Text sizeNormal heavy>{item.accountNumber}</Text>
            </Body>
          </Row>

          <Row style={styles.listItemRow.self}>
            <Left flex04 style={styles.listItemRow.left}>
              <Text sizeNormal light style={styles.listItemRow.text}>{I18n.t( 'Address' )}</Text>
            </Left>
            <Body>
            <Text sizeNormal heavy>{item.completeAddress}</Text>
            </Body>
          </Row>

          <Row style={styles.listItemRow.self}>
            <Left flex04 style={styles.listItemRow.left}>
              <Text sizeNormal light style={styles.listItemRow.text}>{I18n.t( 'Service' )}</Text>
            </Left>
            <Body>
            <Text sizeNormal heavy>{(item.indPrepayment ? I18n.t( 'Prepaid' ) : I18n.t( 'Postpaid' ) )}</Text>
            </Body>
          </Row>

          <Row style={styles.listItemRow.self}>
            <Left flex04 style={styles.listItemRow.left}>
              <Text sizeNormal light style={styles.listItemRow.text}>{I18n.t( 'Meter' )}</Text>
            </Left>
            <Body>
            <Text sizeNormal heavy>{( item.serialNumber ? item.serialNumber.join() : '-')}</Text>
            </Body>
          </Row>

          <Row style={styles.listItemRow.self}>
            <Left flex04 style={styles.listItemRow.left}>
              <Text sizeNormal light style={styles.listItemRow.text}>{I18n.t( 'Balance' )}</Text>
            </Left>
            <Body>
            <Text sizeNormal heavy>{Numeral( item.balance ).format( "0,000.00" )}</Text>
            </Body>
          </Row>


        </TouchableOpacity>
      </ListItem>
    )
  }

  render() {
    return (
      <Container>
        <SubHeader back isHeader text={I18n.t( 'Accounts' )} {...this.props}/>

        <Content padder>
          <FlatList data={this.state.accounts}
                    style={sharedStyles.margin('bottom', 5)}
                    renderItem={this.renderItem}
                    keyExtractor={( item, index ) => item.idPaymentForm.toString()}
                    ListEmptyComponent={NoDataFound}
          />
        </Content>
      </Container>
    );
  }
}



function bindAction( dispatch ) {
  return {
    selectAccount: ( account ) => dispatch(selectAccount(account)),
  };
}

const mapStateToProps = state => {
  return {
  }
};


export default connect(mapStateToProps, bindAction)(Accounts);


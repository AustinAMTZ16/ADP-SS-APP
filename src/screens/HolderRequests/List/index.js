import React, { Component } from "react";
import {
  Text,
  Content,
  Container,
  Left,
  Body,
  ListItem,
  Row,
  Icon
} from "native-base";
import { FlatList, TouchableOpacity } from "react-native";
import I18n from 'react-native-i18n';
import PopupDialog from '../../../components/PopupDialog/';
import NoDataFound from '../../../components/NoDataFound/';
import Header from '../../../components/Header';
import SubHeader from '../../../components/SubHeader';
import sharedStyles from '../../../shared/styles';
import styles from './styles'
import generalService from '../../../services/general/generalService';
import waterfall from 'async/waterfall';
import repo from '../../../services/database/repository'
import moment from 'moment'
import Spinner from '../../../components/Spinner';
import TimerMixin from "react-timer-mixin";


class HolderRequests extends Component {
  constructor( props ) {
    super(props);

    this.state = {
      data: [],
      spinnerVisible: false,
    };
  }

  //getServiceCustomerAction

  componentDidMount() {
    this.loadData();
  }

  loadData() {

    this.setState({ spinnerVisible: true });
    waterfall([
      ( callback ) => {
        let idCustomer = repo.configuration.getField('idCustomer');
        generalService.getServiceCustomerAction(idCustomer, callback);
      },

    ], ( err, result ) => {

      if( !err ) {
        this.setState({ spinnerVisible: false, data: result }, function(  ) {

        });


      } else {
        this.setState({ spinnerVisible: false }, function() {
          //TODO Review this test
          TimerMixin.setTimeout(() => {
            this.showPopupAlert(I18n.t("INFO"), I18n.t("NO_DATA"));
          }, 1000);

        });

      }
    })
  }


  /**
   *
   * @param title
   * @param text
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
    return (
      <ListItem column borderDark>
        <Row style={sharedStyles.margin('bottom', 2)}>
          <Left>
            <Text sizeNormal heavy>{item.reference}</Text>
          </Left>
        </Row>
        <Row style={styles.listItemRow.self}>
          <Left flex04 style={styles.listItemRow.left}>
            <Text sizeNormal light style={styles.listItemRow.text}>{I18n.t('Status')}:</Text>
          </Left>
          <Body>
          <Text sizeNormal heavy>{item.descStatus}</Text>
          </Body>
        </Row>
        <Row style={styles.listItemRow.self}>
          <Left flex04 style={styles.listItemRow.left}>
            <Text sizeNormal light style={styles.listItemRow.text}>{I18n.t('Last_Change')}:</Text>
          </Left>
          <Body>
          <Text sizeNormal heavy>{item.date ? moment(new Date(item.date)) : null}</Text>
          </Body>
        </Row>
      </ListItem>
    )
  }

  render() {
    return (
      <Container>
        <Header {...this.props} noDrawer
                iconAction={true}/>
        <SubHeader text={I18n.t('Customer_Requests')} back={true}
                   menu={{
                     icon: 'ios-list-outline', isOpened: true,
                     items:
                       <TouchableOpacity style={styles.menu.item}
                                         onPress={() => this.props.navigation.navigate('HolderRequestSearch')}>
                         <Icon name="ios-list-outline" style={styles.menu.icon}/>
                         <Text white sizeNormal>{I18n.t('MSG007')}</Text>
                       </TouchableOpacity>
                   }} {...this.props} />
        <PopupDialog
          refModal={this.state.messageAlert}
        />
        <Content padder>
          <FlatList data={this.state.data}
                    extraData={this.state}
                    style={sharedStyles.margin('bottom', 5)}
                    renderItem={this.renderItem}
                    ListEmptyComponent={NoDataFound}
          />
        </Content>
        <Spinner visible={this.state.spinnerVisible} textContent="..."/>
      </Container>
    );
  }
}

export default HolderRequests;

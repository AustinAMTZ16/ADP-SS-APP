import React, { Component } from "react";
import { Image, FlatList, TouchableOpacity } from 'react-native';
import { Text, View, Content, Container, Left, Body, ListItem, Row, Icon } from "native-base";
import { Field, reduxForm } from "redux-form";
import { connect } from 'react-redux';
import I18n from 'react-native-i18n';

import NoDataFound from '../../../components/NoDataFound/';
import Header from '../../../components/Header';
import SubHeader from '../../../components/SubHeader';
import sharedStyles from '../../../shared/styles';
import styles from './styles'
import repo from '../../../services/database/repository'
import generalService from "../../../services/general/generalService";
import waterfall from "async/waterfall";
import Spinner from '../../../components/Spinner';
import * as OpenAnything from "react-native-openanything";
import Config from 'react-native-config';
import moment from 'moment-timezone';
import TimerMixin from "react-timer-mixin";
import PopupDialog from '../../../components/PopupDialog/';
import { formatLocaleDate } from '../../../shared/validations';


class Outages extends Component {

  constructor() {
    super();

    this.state = {
      spinnerVisible: false,
      parent: null,
    }
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
        let idDocument = repo.configuration.getField('idCustomer');
        generalService.getOutageAction(idDocument, callback);
      }
    ], ( err, result ) => {
      if(!err){
        if(result && result.length){
          this.setState({
            spinnerVisible: false,
            data: result
          });
        } else {
          this.setState({ data: null, spinnerVisible: false});
        }
      }else{
        console.log("ERR2: " + err);
        this.setState({ spinnerVisible: false }, function() {
          TimerMixin.setTimeout(() => {
            this.showPopupAlert(I18n.t("HAS_ERROR"), I18n.t("HAS_ERROR_RETRY"));
          }, 1000);
        }.bind(this));
      }
    });
  }

  componentWillReceiveProps( nextProps ) {
    if( this.props.reloadListOutages !== nextProps.reloadListOutages) {
      this.loadData();
    }
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
        <Row style={styles.listItemRow.self}>
          <Left flex05 style={styles.listItemRow.left}>
            <Text sizeNormal light style={styles.listItemRow.text}>{I18n.t('WARNING_CODE')}</Text>
          </Left>
          <Body>
          <Text sizeNormal heavy>{item.warningCode}</Text>
          </Body>
        </Row>

        <Row style={styles.listItemRow.self}>
          <Left flex05 style={styles.listItemRow.left}>
            <Text sizeNormal light style={styles.listItemRow.text}>{I18n.t('DATE')}</Text>
          </Left>
          <Body>
          <Text sizeNormal heavy>{( item.creationDate ? formatLocaleDate(item.creationDate) : '-')}</Text>
          </Body>
        </Row>

        <Row style={styles.listItemRow.self}>
          <Left flex05 style={styles.listItemRow.left}>
            <Text sizeNormal light style={styles.listItemRow.text}>{I18n.t('Status')}</Text>
          </Left>
          <Body>
          <Text sizeNormal heavy>{item.statusDesc}</Text>
          </Body>
        </Row>

        <Row style={styles.listItemRow.self}>
          <Left flex05 style={styles.listItemRow.left}>
            <Text sizeNormal light style={styles.listItemRow.text}>{I18n.t('Description')}</Text>
          </Left>
          <Body>
          <Text sizeNormal heavy>{item.nameType}</Text>
          </Body>
        </Row>

        <Row style={styles.listItemRow.self}>
          <Left flex05 style={styles.listItemRow.left}>
            <Text sizeNormal light style={styles.listItemRow.text}>{I18n.t('CustomerName')}</Text>
          </Left>
          <Body>
          <Text sizeNormal heavy>{item.customer}</Text>
          </Body>
        </Row>
      </ListItem>
    )
  }
  _keyExtractor = ( item, index ) => item.warningCode.toString();


  render() {
    return (
      <Container>
        <Header {...this.props} noDrawer
                iconAction={true}/>

        <SubHeader text={I18n.t('Outages')} back={true}
                   {...this.props}
                   menu={{
                     icon: 'ios-list-outline', isOpened: true,
                     items:
                       <View>
                         <TouchableOpacity style={styles.menu.item}
                                           onPress={() => this.props.navigation.navigate('OutagesReport',{mode:'SUPPLY'})}>
                           <Icon name="ios-list-outline" style={styles.menu.icon}/>
                           <Text white sizeNormal>{I18n.t('ReportPowerFailure')}</Text>
                         </TouchableOpacity>
                         
                         <TouchableOpacity style={styles.menu.item}
                                           onPress={() => this.props.navigation.navigate('OutagesReport',{mode:'ADDRESS'})}>
                           <Icon name="ios-list-outline" style={styles.menu.icon}/>
                           <Text white sizeNormal>{I18n.t('ReportOutagesCoor')}</Text>
                         </TouchableOpacity>

                         <TouchableOpacity style={styles.menu.item}
                                           onPress={() => OpenAnything.Open(Config.POWER_INTERRUPTIONS)}>
                           <Icon name="ios-list-outline" style={styles.menu.icon}/>
                           <Text white sizeNormal>{I18n.t('MORE_FAILURES')}</Text>
                         </TouchableOpacity>
                       </View>
                   }}
        />
        <PopupDialog
            refModal={this.state.messageAlert}
        />

        <Content padderHorizontal>
          <FlatList data={this.state.data}
                    style={sharedStyles.margin('bottom', 5)}
                    renderItem={this.renderItem}
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

const OutagesPage = reduxForm({
  form: "BillMeterQuery"
})(Outages);


Component.propTypes = {};

const mapStateToProps = state => {
  return {
    reloadListOutages: state.generalReducer.reloadListOutages
  }
};


export default connect(mapStateToProps)(OutagesPage);

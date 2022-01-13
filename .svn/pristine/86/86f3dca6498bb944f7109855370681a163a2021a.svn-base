import React, { Component } from "react";
import { Image, FlatList, TouchableOpacity, Alert } from 'react-native';
import {Button, Text, View, Content, Container, Left, Body, ListItem, Row, Icon } from "native-base";
import { Field, reduxForm } from "redux-form";
import { connect } from 'react-redux';
import I18n from 'react-native-i18n';

import NoDataFound from '../../../components/NoDataFound/';
import Header from '../../../components/Header';
import SubHeader from '../../../components/SubHeader';
import {createAlert} from '../../../components/ScreenUtils';
import moment from 'moment-timezone';

import sharedStyles from '../../../shared/styles';
import styles from './styles'


import repo from '../../../services/database/repository'
import messageService from '../../../services/general/messageService';
import waterfall from "async/waterfall";
import Spinner from '../../../components/Spinner';
import {platformStyle} from "../../../theme";
import TimerMixin from "react-timer-mixin";
import PopupDialog from '../../../components/PopupDialog/';
import { formatLocaleDate } from '../../../shared/validations';


class AlertList extends Component {

  constructor() {
    super();

    this.state = {
      spinnerVisible: false,
      parent: null
    }
  }

  componentDidMount() {
    this.getAlertList();
  }

  getAlertList(){
    this.setState({
      spinnerVisible: true
    });
    waterfall([
      (callback ) => {
        let idDocument = repo.configuration.getField('idCustomer');
        messageService.getAlertList(idDocument, callback);
      }
    ], ( err, result ) => {
      if(!err){
        if(result && result.length){
          //Last messages first in the list
          result.sort(function (a, b) {
            return b.idAlert - a.idAlert;
          });

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

  onAlertUpdate(){
    this.getAlertList();
  }

  selectAlert(item){
    if(item.signature==true) {
      this.props.navigation.navigate('AlertDetail',{onGoBack: (param) => this.onAlertUpdate(param),item: item,mode:'SIGNATURE'});
      return;
    }else if(item.description && item.description.includes("http")==true) {
      this.props.navigation.navigate('AlertDetail',{item: item,mode:'NAVIGATION'});
    }
    
    if(item.messageRead==false){
      //1. First update view. Then call to server
      // OPTION 2: Refresh only in frontend, instead of using backend
      var updatedList = [];
      _.map( this.state.data, function( itemAlert ) {
        if(itemAlert.idAlert==item.idAlert){
          item.messageRead=true;
        }
        updatedList.push(itemAlert);
      });
      this.setState({
        data: updatedList,
        spinnerVisible: true
      });

      //2. Call notify alert
      waterfall([
        (callback ) => {
          let idCustomer = repo.configuration.getField('idCustomer');
          messageService.notifyAlert(item.idAlert, callback);
        }
      ], ( err, result ) => {
        if(err){
          TimerMixin.setTimeout(() => {
            this.setState({...err,spinnerVisible: false})
          }, 1000);
        }else{
          //3. Update menu quantity
          repo.configuration.setField('alertsNumber', repo.configuration.getField("alertsNumber")-1);
          TimerMixin.setTimeout(() => {
            this.setState({spinnerVisible: false})
          }, 200);
        }
      });
    }
  }

  renderItem( { item } ) {
    var creationDate = item.creationDate ? formatLocaleDate(item.creationDate) : '-';

    return (
      <ListItem column borderDark onPress={() => this.selectAlert(item)}>
        <Row style={styles.listItemRow.self}>
          <Body>
          {(item.messageRead) ?
              <Text sizeNormal >{creationDate}</Text> :
              <Text sizeNormal heavy>{creationDate}</Text>
          }
          </Body>
        </Row>

        <Row style={styles.listItemRow.self}>
          <Body>

          {(item.messageRead) ?
              <Text sizeNormal >{item.description}</Text> :
              <Text sizeNormal heavy>{item.description}</Text>
          }

          </Body>
        </Row>

        {(item.messageRead==false) ?
            <View style={{ position: 'absolute', top: 12, left: 100 }}>
              <Button roundedCircleSmall style={{ width: 10, height: 10}}>
              </Button>
            </View> :
            null
        }

      </ListItem>
    )
  }

  _keyExtractor = ( item, index ) => item.idAlert.toString();

  render() {
    return (
      <Container>
        <Header {...this.props} noDrawer
                iconAction={true}/>

        <SubHeader text={I18n.t('ALERT_LIST')} back={true}
            {...this.props}
        />

        <PopupDialog
            refModal={this.state.messageAlert}
        />

        <Content padderHorizontal>
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

function bindAction( dispatch ) {
  return {};
}

const mapStateToProps = state => ({});

export default connect(mapStateToProps, bindAction)(AlertList);

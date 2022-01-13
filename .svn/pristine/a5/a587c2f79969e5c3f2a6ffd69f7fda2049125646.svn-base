import React, { Component } from "react";
import { Image, FlatList, TouchableOpacity, Alert } from 'react-native';
import {Button, Text, View, Content, Container, Left, Body, ListItem, Row, Icon } from "native-base";
import { Field, reduxForm } from "redux-form";
import { connect } from 'react-redux';
import I18n from 'react-native-i18n';

import NoDataFound from '../../../components/NoDataFound/';
import Header from '../../../components/Header';
import SubHeader from '../../../components/SubHeader';
import moment from 'moment-timezone';

import sharedStyles from '../../../shared/styles';
import styles from './styles'


import repo from '../../../services/database/repository'
import messageService from '../../../services/general/messageService';
import waterfall from "async/waterfall";
import Spinner from '../../../components/Spinner';
import TimerMixin from "react-timer-mixin";
import PopupDialog from '../../../components/PopupDialog/';
import Config from 'react-native-config';
import { formatLocaleDate } from '../../../shared/validations';

class Webmail extends Component {

  constructor() {
    super();

    this.state = {
      spinnerVisible: false,
      parent: null,
    }
  }

  componentDidMount() {
    this.getCommunications();
  }

  getCommunications(){
    this.setState({
      spinnerVisible: true
    });
    waterfall([
      (callback ) => {
        let idDocument = repo.configuration.getField('idCustomer');
        messageService.getCommunicationAction(idDocument, callback);
      }
    ], ( err, result ) => {
      if(!err){       
        if(result && result.communications && result.communications.length){
          //Last messages first in the list
          let res = result.communications;
          res.sort(function (a, b) {
            return b.idCommunication - a.idCommunication;
          });

          this.setState({
            spinnerVisible: false,
            data: res
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

  /**
   * This method will:
   * 1. Mark as read mail calling API
   * 2. Change apparence, remove bold
   * 3. Open PDF navigation
   * @param item
   */
  showPdf( item ) {
    //1. Call notify communication
    if(item.messageRead==false){
      waterfall([
        (callback ) => {
          let idCustomer = repo.configuration.getField('idCustomer');
          messageService.notifyCommunicationAction(idCustomer,item.idCommunication, callback);
        }
      ], ( err, result ) => {
        if(!err){
          //2. Update menu webmail quantity
          repo.configuration.setField('commNumber', repo.configuration.getField("commNumber")-1);
        }else{
          TimerMixin.setTimeout(() => {
            this.setState(err)
          }, 1000);
        }
      });
    }

    //3. Open PDF viewer
    let endPoint = Config.ENDPOINT_PROD_PREVIEW_HTML;
    endPoint = `${endPoint}/${item.idCommunication}/pdf`;
	let API_URL = repo.configuration.getField('domain');
	let filename = `${item.idCommunication}.pdf`;
	let TENANT = repo.configuration.getField('tenantId');
	if(Config.IS_MULTITENANT === "true" && TENANT.length){
		endPoint = "/t/" + TENANT + endPoint;
	}
	  
	let URL_FINAL = API_URL+endPoint;
	URL_FINAL = URL_FINAL.replace("{apiVersion}", repo.configuration.getField('apiVersion'));
  
	this.props.navigation.navigate('ViewPDF',{
      	downloadUrl: URL_FINAL,
      	title: I18n.t('Webmail'),
      	filename: filename
    });
  }

  renderItem( { item } ) {
    var creationDate = item.creationDate ? formatLocaleDate(item.creationDate) : '-';

    return (
      <ListItem column borderDark>
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
              <Text sizeNormal >{item.nameType}</Text> :
              <Text sizeNormal heavy>{item.nameType}</Text>
          }

          </Body>
        </Row>

        <View style={{ position: 'absolute', bottom: 10, right: 0 }}>
          <Button roundedCircleSmall onPress={this.showPdf.bind(this, item)}>
            <Text heavy small>PDF</Text>
          </Button>
        </View>

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

  _keyExtractor = ( item, index ) => item.idCommunication.toString();

  render() {
    return (
      <Container>
        <Header {...this.props} noDrawer
                iconAction={true}/>

        <SubHeader text={I18n.t('Webmail')} back={true}
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

export default connect(mapStateToProps, bindAction)(Webmail);

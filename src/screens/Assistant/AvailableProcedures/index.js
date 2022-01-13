import React, { Component } from "react";
import { Image, FlatList, TouchableOpacity, Alert } from 'react-native';
import {Button, Text, View, Content, Container, Left, Body, ListItem, Row, Icon } from "native-base";
import { Field, reduxForm } from "redux-form";
import { connect } from 'react-redux';
import I18n from 'react-native-i18n';
import * as OpenAnything from 'react-native-openanything';
import waterfall from "async/waterfall";
import TimerMixin from "react-timer-mixin";

import { reloadMenu } from '../../../actions/general';
import NoDataFound from '../../../components/NoDataFound/';
import Header from '../../../components/Header';
import SubHeader from '../../../components/SubHeader';
import sharedStyles from '../../../shared/styles';
import styles from './styles'
import repo from '../../../services/database/repository'
import assistantService from '../../../services/general/assistantService';
import Spinner from '../../../components/Spinner';
import PopupDialog from '../../../components/PopupDialog/';
import { formatLocaleDate } from '../../../shared/validations';
import {createAlert} from '../../../components/ScreenUtils';


class AvailableProcedures extends Component {

  constructor() {
    super();

    this.state = {
      spinnerVisible: false,
      selected:{
        idRemoteServiceType:0
      }
    }
  }

  componentDidMount() {
    this.getProcedureList();
  }

  getProcedureList(){
    this.setState({
      spinnerVisible: true,
      selected:{
        idRemoteServiceType:0
      }
    });
    waterfall([
      (callback ) => {
        let idCustomer = repo.configuration.getField('idCustomer');
        assistantService.getRemoteServicePending(idCustomer, callback);
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
        this.setState({ spinnerVisible: false }, function() {
          TimerMixin.setTimeout(() => {
            this.setState(err)
          }, 1000);
        }.bind(this));
      }
    });
  }

  selectProcedure(item){
      this.setState({ selected: item, scheduled:item.remoteServiceDate!=null});
  }

  renderItem( { item } ) {
    let remoteServiceDate = item.remoteServiceDate ? formatLocaleDate(item.remoteServiceDate) : '';
    let selected = this.state.selected.idRemoteServiceType==item.idRemoteServiceType;
    return (
      <ListItem column borderDark onPress={() => this.selectProcedure(item)}>
        <Row style={styles.listItemRow.self}>
          <Body>
          {(item.remoteServiceDate) ?
              <Text sizeNormal heavy>{remoteServiceDate + " " + item.remoteServiceFrom}</Text> :null
          }
          </Body>
        </Row>

        <Row style={styles.listItemRow.self}>
          <Body>
          <Text sizeNormal style={selected===true?{...styles.highLight}:null}>{item.remoteServiceType}</Text>
          </Body>
        </Row>
      </ListItem>
    )
  }

  _keyExtractor = ( item, index ) => index.toString();

  onInmediate(){
    waterfall([
      (callback ) => {
        let idRemoteServiceType = this.state.selected.idRemoteServiceType;
        let idCustomer = repo.configuration.getField('idCustomer');
        assistantService.newRemoteServiceImmediate(idCustomer,idRemoteServiceType, callback);
      }
    ], ( err, result ) => {
      if(!err){
        
        if(result.data){
          this.getProcedureList();
          this.props.reloadMenuAlerts();
          OpenAnything.Open(result.data.urlCall);
        }else{
          TimerMixin.setTimeout(() => {
            this.setState({
              messageAlert: createAlert(I18n.t("RETRY"), I18n.t("REMOTE_ASSISTANT_NO_AGENTS"))
            });
          }, 1000);
        }
      }else{
        TimerMixin.setTimeout(() => {
          this.setState(err)
        }, 1000);
      }
    });
  }

  onSchedule(){
    console.log("onSchedule");
    this.props.navigation.navigate('AssistantScheduleScreen',{
      procedure: this.state.selected,
      onGoBack: () => this.onProcedureUpdate()
    })
  }
  
  onProcedureUpdate(){
    this.getProcedureList();
  }

  onRequirements(){    
    this.props.navigation.navigate('ViewHTML',{
      htmlToShow: this.state.selected.urlCondition,
      title: I18n.t('REMOTE_ASSISTANT_REQUIREMENTS'),
      onlyImage: true
    })
  }

  onDelete(){
    let options =  {
      1: {
        key: 'button1',
        text: `${I18n.t('accept')}`,
        action: () => this.delete(),
        align: ''
      },
      2: {
        key: 'button2',
        text: `${I18n.t('Cancel')}`,
        align: ''
      }
    };

    TimerMixin.setTimeout(() => {
      this.setState({
        messageAlert: createAlert(I18n.t("INFO"), I18n.t("REMOTE_ASSISTANT_DELETE_CONF"),options)
      });
    }, 500);
  }

  delete(){
    waterfall([
      (callback ) => {
        let idRemoteService = this.state.selected.idRemoteService;
        assistantService.cancelRemoteService(idRemoteService, callback);
      }
    ], ( err, result ) => {
      if(!err){
        this.setState({
          messageAlert: createAlert(I18n.t("INFO"), I18n.t("OPERATION_SUCCESS2")),
          selected:{
            idRemoteServiceType:0
          }
        }, function(){
          this.getProcedureList();
        });

      }else{
        TimerMixin.setTimeout(() => {
          this.setState(err)
        }, 1000);
      }
    });
  }

  onStart(){  
    OpenAnything.Open(this.state.selected.urlCall);
  }

  render() {
    let { selected,scheduled } = this.state;
    let sel = selected.idRemoteServiceType>0;
    return (
      <Container>
        <Header {...this.props} noDrawer iconAction={true}/>
        <SubHeader text={I18n.t('REMOTE_ASSISTANT_AVAILABLE')} back={true}
            {...this.props}
                   menu={{
                     icon: 'ios-list-outline',
                     isOpened: true,
                     items:
                       <View>
                        {sel?
                         <TouchableOpacity style={styles.menu.item}
                                           onPress={() => this.onRequirements()}>
                           <Icon name="ios-list-outline" style={styles.menu.icon}/>
                           <Text white sizeNormal>{I18n.t('REMOTE_ASSISTANT_REQUIREMENTS')}</Text>
                         </TouchableOpacity>
                         :null}

                         {sel && !scheduled?
                         <TouchableOpacity style={styles.menu.item}
                                           onPress={() => this.onSchedule()}>
                           <Icon name="ios-list-outline" style={styles.menu.icon}/>
                           <Text white sizeNormal>{I18n.t('REMOTE_ASSISTANT_SCHEDULE')}</Text>
                         </TouchableOpacity>:null}

                          {sel && !scheduled?
                         <TouchableOpacity style={styles.menu.item}
                                           onPress={() => this.onInmediate()}>
                           <Icon name="ios-list-outline" style={styles.menu.icon}/>
                           <Text white sizeNormal>{I18n.t('REMOTE_ASSISTANT_INMEDIATE')}</Text>
                         </TouchableOpacity>:null}

                          {sel && scheduled?
                         <TouchableOpacity style={styles.menu.item}
                                           onPress={() => this.onStart()}>
                           <Icon name="ios-list-outline" style={styles.menu.icon}/>
                           <Text white sizeNormal>{I18n.t('REMOTE_ASSISTANT_START')}</Text>
                         </TouchableOpacity>:null}

                          {sel && scheduled?
                         <TouchableOpacity style={styles.menu.item}
                                           onPress={() => this.onDelete()}>
                           <Icon name="ios-list-outline" style={styles.menu.icon}/>
                           <Text white sizeNormal>{I18n.t('REMOTE_ASSISTANT_DELETE')}</Text>
                         </TouchableOpacity>:null}
                       </View>
                   }}
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

function bindAction(dispatch) {
  return {
    reloadMenuAlerts: () => dispatch(reloadMenu())
  };
}

const mapStateToProps = state => ({});

export default connect(mapStateToProps, bindAction)(AvailableProcedures);

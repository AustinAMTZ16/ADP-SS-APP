import React, { Component } from "react";
import { Image } from "react-native";
import {
  Container,
  Content,
  Text,
  Row,
  Col,
  ListItem,
  Button,
  View
} from "native-base";
import Spinner from 'react-native-loading-spinner-overlay';
import { connect } from 'react-redux';
import sharedStyles from '../../shared/styles'
import I18n from 'react-native-i18n';
import _ from 'lodash'
import styles from './styles'
import { logInRedux, loggedOutRedux } from '../../actions/security'
import IconFontello from '../../components/IconFontello/';
import {platformStyle} from "../../theme";
import securityService from "../../services/security/securityService";
import waterfall from 'async/waterfall';
import IconFontAwesome from 'react-native-vector-icons/FontAwesome';
import repo from '../../services/database/repository';
import messageService from '../../services/general/messageService';
import TimerMixin from "react-timer-mixin";
import PopupDialog from '../../components/PopupDialog/';


class SideBar extends Component {
  constructor( props ) {
    super(props);
    this.state = {
      spinnerVisible: false,
      alertsNumber:0,
      commNumber:0,
    };

    this.loadDataMenu = this.loadDataMenu.bind(this);
  }

  componentWillReceiveProps( nextProps ) {   
    if( this.props.reloadMenu !== nextProps.reloadMenu  ) {   
      this.getMessagesCount();
    }
  }

  componentDidMount() {
    this.getMessagesCount();
  }

  getMessagesCount(){
    this.setState({
      spinnerVisible: true
    });
    waterfall([
      (callback ) => {
        let idCustomer = repo.configuration.getField('idCustomer');
        if(idCustomer>0){
          messageService.getMessagesCount(idCustomer, callback);  
        }
      }
    ], ( err, result ) => {
      if(!err){
        if(result){
          if(result.alerts>99){
            result.alerts=99;
          }

          if(result.communications>99){
            result.communications=99;
          }

          repo.configuration.setField('alertsNumber', result.alerts);
          repo.configuration.setField('commNumber', result.communications);

          this.setState({
            spinnerVisible: false,
            alertsNumber: result.alerts,
            commNumber: result.communications
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
  
  loadDataMenu() {
    return [
      {
        link: "OtherAccounts",
        icon: "file",
        type: "IconFontAwesome",
        text: I18n.t('OTHER_ACCOUNTS')
      },
      {
        link: "Webmail",
        icon: "envelope",
        type: "IconFontAwesome",
        text: I18n.t('Webmail')
      },
      {
        link: "AlertList",
        icon: "bell",
        type: "IconFontAwesome",
        text: I18n.t('ALERT_LIST')
      },
      /*{
        link: "NewApplications",
        icon: "new-app",
        param: { parent: 'PRIVATE' },
        text: I18n.t('NewApplications')
      },*/
      {
        link: "ServiceRequests",
        icon: "new-app",
        param: { parent: 'PRIVATE' },
        text: I18n.t('SERVICE_REQUESTS')
      },
      {
        link: "ComplaintsSuggestions",
        icon: "complain",
        param: { parent: 'PRIVATE' },
        text: I18n.t('RCCS')
      },
      {
        link: "Assistant",
        icon: "headphones",
        type: "IconFontAwesome",
        param: { parent: 'PRIVATE' },
        text: I18n.t('REMOTE_ASSISTANT')
      },
      {
        link: "MyData",
        icon: "person",
        text: I18n.t('MyData')
      },
      {
        link: "ChangePassword",
        icon: "cogs",
        type: "IconFontAwesome",
        text: I18n.t('ChangePassword')
      },
      // {
      //   link: "ChangeLanguage",
      //   icon: "language",
      //   type: "IconFontAwesome",
      //   text: I18n.t('CHANGE_LANGUAGE')
      // },
      {
        link: "Help",
        icon: "question",
        type: "IconFontAwesome",
        text: I18n.t('HELP')
      },
      {
        link: "HolderRequests",
        icon: "logout",
        action: "toPublic",
        text: I18n.t('Logout')
      }

    ];
  }


  logout() {
    this.setState({ spinnerVisible: true });
    this.props.navigation.navigate('DrawerLogin');

    waterfall([
      ( callback ) => {
        securityService.logoutAction(callback);
      },
      ( arg1, callback ) => {
        securityService.autenticateAction('client_credentials', null, null, callback);
      },
    ], ( err, result ) => {
      this.setState({ spinnerVisible: false });
      this.props.loggedOutRedux();
    });
  }

  menuNavigation(menuItemRow){
    const navigation = this.props.navigation;
    if( menuItemRow.action === 'toPrivate' )
      this.props.logInRedux();
    else if( menuItemRow.action === 'toPublic' ) {
      repo.configuration.setField('user_remember', false );
      repo.configuration.setField('bannerListCacheData',null);//WE SET OLD DATE IN ORDER TO REFRESH CACHE
      repo.configuration.setField('loginWithFingerprint', false );
      repo.configuration.setField('password_remember', false );
      repo.configuration.setField('idCustomer', null );
      repo.configuration.setField('idPaymentForm', null );
      repo.configuration.setField('consumptionMeter', null );
      repo.configuration.setField('consumptionUsage', null );
      repo.configuration.setField('customerData', JSON.stringify({}) );
      repo.configuration.setField('accountServices', JSON.stringify({}) );
      repo.configuration.setField('accountDetail', JSON.stringify({}) );
      repo.configuration.setField('accountAdditionalData', JSON.stringify({}) );
      repo.configuration.setField('bills', JSON.stringify({}) );
      repo.configuration.setField('recharges', JSON.stringify({}) );
      repo.configuration.setField('accountAgreement', JSON.stringify({}) );
      repo.configuration.setField('consumptionMeters', JSON.stringify({}) );
      repo.configuration.setField('consumptionUsages', JSON.stringify({}) );
      repo.configuration.setField('consumptionLoadData', JSON.stringify({}) );
      repo.configuration.setField('accountListAction', JSON.stringify({}) );
      this.logout();
    }else {
      if( menuItemRow.param )
        navigation.navigate(menuItemRow.link, menuItemRow.param);
      else
        navigation.navigate(menuItemRow.link);
      
      if(menuItemRow.link=="MyData"){
        repo.configuration.setField('adpProgramData',"");
      }
    }
  }

  render() {

    const navigation = this.props.navigation;
    let menus = this.loadDataMenu();

    const alertsNumber = repo.configuration.getField('alertsNumber');
    const commNumber = repo.configuration.getField('commNumber');   

    return (
      <Container>
        <Content style={{...styles.content, backgroundColor: platformStyle.brandPrimary}}>
          {_.map(menus, ( menuItemRow, index ) =>
            <ListItem key={index} button
                      style={index === 0 && platformStyle.platform === 'ios' ? {...styles.item, marginTop: 15, borderColor: platformStyle.brandLight} : {...styles.item, borderColor: platformStyle.brandLight}}
                      onPress={() => {this.menuNavigation(menuItemRow)}}>
              <Row>
                <Col style={{ flex: 0.2, justifyContent: 'center', alignItems: 'center' }}>

                  {menuItemRow.type === 'IconFontAwesome' ?
                    <IconFontAwesome name={menuItemRow.icon}
                                     style={{ color: platformStyle.brandWhite, fontSize: 24 }}/> :
                    <IconFontello name={menuItemRow.icon}
                                  style={{ color: platformStyle.brandWhite, fontSize: menuItemRow.iconSize ? menuItemRow.iconSize : 26 }}/>}

                </Col>
                <Col style={{ justifyContent: 'center' }}>
                <Text sizeNormal white style={sharedStyles.alignSelf('start')}>{menuItemRow.text}</Text>
                  {this.state.alertsNumber>0 && menuItemRow.link =='AlertList'?
                        <Button roundedCircleSmall onPress={() => {this.menuNavigation(menuItemRow)}} style={{ width: 20, height: 20,backgroundColor:"red"}}>
                          <Text sizeNormal white style={sharedStyles.alignSelf('start')}>{alertsNumber}</Text>
                        </Button>
                      :
                      null
                  }

                  {this.state.commNumber>0 && menuItemRow.link =='Webmail'?
                      <Button roundedCircleSmall onPress={() => {this.menuNavigation(menuItemRow)}} style={{ width: 20, height: 20,backgroundColor:"red"}}>
                        <Text sizeNormal white style={sharedStyles.alignSelf('start')}>{commNumber}</Text>
                      </Button>
                      :
                      null
                  }
                </Col>
              </Row>
            </ListItem>
          )}
        </Content>

        <Spinner visible={this.state.spinnerVisible} textContent="..."/>
      </Container>
    );
  }
}

function bindAction( dispatch ) {
  return {
    logInRedux: () => dispatch(logInRedux()),
    loggedOutRedux: () => dispatch(loggedOutRedux()),
  };
}

const mapStateToProps = state => {
  return {
    reloadMenu: state.generalReducer.reloadMenu
  }
};


export default connect(mapStateToProps, bindAction)(SideBar);


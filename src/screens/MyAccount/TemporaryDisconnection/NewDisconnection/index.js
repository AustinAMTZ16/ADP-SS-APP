import React, { Component } from "react";
import { Text, Button, Content, Container, Footer, FooterTab } from "native-base";
import { Keyboard } from 'react-native';
import I18n from 'react-native-i18n';
import { Field, reduxForm } from "redux-form";
import { connect } from 'react-redux';
import moment from 'moment';

import Header from '../../../../components/Header';
import YellowSubHeader from '../../../../components/YellowSubHeader';
import SubMenu from '../../SubMenu';
import repo from '../../../../services/database/repository';
import FormPickerDate from '../../../../components/FormPickerDate/'
import {platformStyle} from "../../../../theme";
import sharedStyles from '../../../../shared/styles';
import Spinner from '../../../../components/Spinner';
import PopupDialog from '../../../../components/PopupDialog/';
import { NavigationActions } from 'react-navigation'
import firebaseService from "../../../../services/firebase/firebaseService";
import { required, minTomorrow, maxDisconection30Days, generateDate } from '../../../../shared/validations';
import { loadDate } from '../../../../actions/general';
import generalService from "../../../../services/general/generalService";

const backAction = NavigationActions.back({
  key: null,
  params: {
	  reload:true
  }
});

class NewDisconnection extends Component {
  constructor( props ) {
    super(props);
    this.state = {
      spinnerVisible: false,
      type:null,
      description:null,
      reRender: new Date().valueOf(),
      indPrepayment: null
    };
  }

  componentDidMount() {
    firebaseService.supervisorAnalytic('NEWDISCONNECTION'); 
    let AdditionalData = JSON.parse(repo.configuration.getField('accountAdditionalData'));
    this.setState({indPrepayment: AdditionalData.indPrepayment});
    
    let tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    let tomorrow2 = new Date();
    tomorrow2.setDate(tomorrow2.getDate() + 2); 
    
    
    this.props.loadDate({
    	disconnectionDate: moment(tomorrow).format("DD/MM/YYYY"),
    	reconnectionDate: moment(tomorrow2).format("DD/MM/YYYY")
    });
    
  }


  
  submit( values ) {
    Keyboard.dismiss();
	
    this.setState({ spinnerVisible: true });
    values.disconnectionDate = generateDate(values.disconnectionDate).getTime();
    values.reconnectionDate = generateDate(values.reconnectionDate).getTime();

    let serviceInfo = JSON.parse(repo.configuration.getField('serviceInfo'));
    let idContractedService = serviceInfo.idContractedService;
    
    generalService.newDisconnection(idContractedService, values, function(err, resp){
        this.setState({ spinnerVisible: false });
        
        if(err){
            this.showPopupAlert("Error", err);
        }else{
        	this.props.navigation.dispatch(backAction);
        	if(this.props.navigation.state.params && this.props.navigation.state.params.reload){
        		this.props.navigation.state.params.reload();
        	}
        }
    	
        
    }.bind(this));
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
        height: 200,
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

  render() {
    return (
      <Container>
        <Header {...this.props} noDrawer/>

        <SubMenu title={I18n.t("NewDisconnection")} noMenu={true} leftIcon={"md-arrow-round-back"} {...this.props} reRender={this.state.reRender}
                 indPrepayment={this.state.indPrepayment}/>
        
        <PopupDialog
          refModal={this.state.messageAlert}
        />
        
        <YellowSubHeader text={I18n.t("SELECT_DATES")} />
        
        <Content padderHorizontal>
        
	        <Field name="disconnectionDate"
	            component={FormPickerDate}
            	dataFormat={repo.configuration.getField("language") == "es" ? "DD/MM/YYYY" : "MM/DD/YYYY"}
	            label={I18n.t('DISCONNECTION_DATE')}
	            icon="md-calendar"
	            validate={[ required, minTomorrow ]}
	        	width={platformStyle.deviceWidth - 70}
	            errorActive
	        />
	        
	        
	        <Field name="reconnectionDate"
	            component={FormPickerDate}
            	dataFormat={repo.configuration.getField("language") == "es" ? "DD/MM/YYYY" : "MM/DD/YYYY"}
	            label={I18n.t('RECONNECTION_DATE')}
	            icon="md-calendar"
	            validate={[ required, maxDisconection30Days ]}
	        	width={platformStyle.deviceWidth - 70}
	            errorActive
	        /> 

	        {platformStyle.platform === 'ios' ?
	            <Button block rounded style={{ backgroundColor: platformStyle.brandPrimary}} onPress={this.props.handleSubmit(this.submit.bind(this))}
	                    style={sharedStyles.margin('top')}>
	              <Text sizeNormal>{I18n.t('Submit')}</Text>
	            </Button> : null
	        }
        </Content>
        <Spinner visible={this.state.spinnerVisible} textContent="..."/>
        <Footer noBorders padder>
          <FooterTab>
            {platformStyle.platform === 'android' ?
              <Button block rounded style={{backgroundColor: platformStyle.brandPrimary}} onPress={this.props.handleSubmit(this.submit.bind(this))}>
                <Text sizeNormal>{I18n.t('Submit')}</Text>
              </Button> : null}
          </FooterTab>
        </Footer>
      </Container>
    );
  }
}

const NewDisconnectionForm = reduxForm({
  form: "DisconnectionForm",
  enableReinitialize: true,
})(NewDisconnection);

const mapStateToProps = state => {
  return ({
	   initialValues: state.generalReducer.loadDate,
  })
};

const bindAction = dispatch => {
  return {
	   loadDate: ( formData ) => dispatch(loadDate(formData)),
  };
};

export default connect(mapStateToProps, bindAction)(NewDisconnectionForm);

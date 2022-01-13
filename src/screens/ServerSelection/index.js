import React, { Component } from "react";
import repo from '../../services/database/repository';
import { Keyboard } from "react-native";
import { View, Content, Button, Text } from "native-base";
import { connect } from 'react-redux';
import { Field, reduxForm, formValueSelector } from "redux-form";
import I18n from 'react-native-i18n';

import { loggedInRedux, loggedOutRedux, loadDataLoginForm } from '../../actions/security';
import ImgBackgroundContainer from '../../components/ImageBackground/';
import { required, email, numeric } from '../../shared/validations';
import FormField from '../../components/FormField/'
import splash from "../../../assets/images/splash_blurred.png";
import styles from './styles';
import {platformStyle, setTheme} from "../../theme";
import Config from 'react-native-config'

const validLogin = ( value ) => (email(value) && numeric(value)) ? 'Invalid username' : null;

class ServerSelection extends Component {
  constructor(props) {
	   super(props);
	   	   
	   this.state = {
		   enableInitConfig: Config.ENABLE_INIT_CONFIG === "true",
		   enableTenantSelection: Config.IS_MULTITENANT === "true",
		   domain: Config.ENABLE_INIT_CONFIG ? repo.configuration.getField('domain') : Config.PRODUCTION_BASE_URL,
		   apiVersion: Config.ENABLE_INIT_CONFIG ? repo.configuration.getField('apiVersion') : Config.PRODUCTION_API_VERSION,
		   tenantId: repo.configuration.getField('tenantId')
	   };
  }

  componentDidMount(val) {
	  
	  setTheme();
	  if(this.state.enableInitConfig){
		  this.serverInput.props.onEndEditing(this.state.domain);
		  this.serverApi.props.onEndEditing(this.state.apiVersion);
	  }
	  if(this.state.enableTenantSelection){
		  this.tenantId.props.onEndEditing(this.state.tenantId);
	  }

	  if(!this.state.enableInitConfig && !this.state.enableTenantSelection){
		  this.props.navigation.navigate('Walkthrough');
	  }
  }
  
  componentWillUnmount() {
  }

  handleChangeDomain = (value)=> {
	  this.setState({domain: value});
	  repo.configuration.setField('domain', value ? value : "");
  };
  
  handleChangeApi = (value)=> {
	  this.setState({apiVersion: value});
	  repo.configuration.setField('apiVersion', value ? value : "");
  };
  
  handleChangeTenant = (value)=> {
	  this.setState({tenantId: value});
	  repo.configuration.setField('tenantId', value ? value : "");
	  setTheme();
  };
	
  submit( values ) {
    Keyboard.dismiss();

    let domain = this.state.domain;
    let api = this.state.apiVersion;
    let tenant = this.state.tenantId;
    
    if(this.state.enableInitConfig){
    	domain = values.server
    	api = values.api ? values.api : ""
    }
    
	repo.configuration.setField('domain', domain);
	repo.configuration.setField('apiVersion', api);
    repo.configuration.setField('tenantId', tenant);

	setTheme();
	
    this.props.navigation.navigate('Walkthrough');
  }


  render() {
    return (
    		 <ImgBackgroundContainer source={splash}>
		     <View style={{...styles.container, backgroundColor: platformStyle.brandPrimary}}>
		       <View style={{ marginTop: 10 }}><Text xlarge white heavy>{I18n.t("SERVER_SELECT")}</Text></View>
		     </View>
    	        <Content padder>
    	          <View style={{ flexDirection: 'row', }}>
    	            <View style={{ width: platformStyle.deviceWidth - 30 }}>

	    	         {this.state.enableInitConfig ?
    	            	(<Field name="server"
		               	  	 ref="server"
		                        component={FormField}
		                        errorActive={true}
		                        keyboardType="url"
		                        validate={[ required ]}
		                 		onChange={this.handleChangeDomain.bind(this)}
		                        inputProps={{
		                       	 ref: c => (this.serverInput = c),
		                            onSubmitEditing: this.props.handleSubmit(this.submit.bind(this)),
		                            value:this.state.domain,
			    	            	autoFocus:true
		                        }}
		                 />)
	    	         :null}
		    	         
	    	         {this.state.enableInitConfig ?
	    	        	(<Field name="api"
		               	  	 ref="api"
		                        component={FormField}
		                        errorActive={true}
		                        keyboardType="url"
		                        //validate={[ required ]}
		                 		onChange={this.handleChangeApi.bind(this)}
		                        inputProps={{
		                       	 ref: c => (this.serverApi = c),
		                            onSubmitEditing: this.props.handleSubmit(this.submit.bind(this)),
		                            value:this.state.apiVersion,
			    	            	autoFocus:true
		                        }}
		    	         />)
	    	         :null}
	    	           
	    	         {this.state.enableTenantSelection ?
	 	    	        	(<Field name="tenant"
		               	  	 ref="tenant"
		                        component={FormField}
		                        errorActive={true}
		                        keyboardType="url"
		                        //validate={[ required ]}
		                 		onChange={this.handleChangeTenant.bind(this)}
		                        inputProps={{
		                       	 ref: c => (this.tenantId = c),
		                            onSubmitEditing: this.props.handleSubmit(this.submit.bind(this)),
		                            value:this.state.tenantId,
			    	            	autoFocus:true
		                        }}
		    	         />)
	    	         :null}
		    	     </View>
    	          </View>
    	          
    	          <Button block rounded wide style={{...styles.loginBtn, backgroundColor: platformStyle.brandPrimary}}
    	                  onPress={this.props.handleSubmit(this.submit.bind(this))}>
    	            <Text>{I18n.t("UPDATE")}</Text>
    	          </Button>

    	        </Content>
    	      </ImgBackgroundContainer>	
    );
  }
}

const ServerSelectionView = reduxForm({
  form: "ServerSelectionForm"
})(ServerSelection);

function bindAction( dispatch ) {
  return {
    loggedInRedux: () => dispatch(loggedInRedux()),
    loggedOutRedux: () => dispatch(loggedOutRedux()),
    loadDataLoginForm: ( formData ) => dispatch(loadDataLoginForm(formData)),
  };
}

const selector = formValueSelector('ServerSelectionForm');
const mapStateToProps = state => {
  return {
    dataForm: selector(state, 'server'),
    initialValues: state.securityReducer.formDataLogin
  }
};


export default connect(mapStateToProps, bindAction)(ServerSelectionView);

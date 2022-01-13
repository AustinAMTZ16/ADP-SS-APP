import React, { Component } from "react";
import { Text, Button, Content, Container, Footer, FooterTab, View, Label, Item, Input } from "native-base";
import { Keyboard } from 'react-native';
import I18n from 'react-native-i18n';
import { Field, reduxForm } from "redux-form";
import { connect } from 'react-redux';

import { selectAccount } from '../../../actions/general';
import repo from '../../../services/database/repository';
import Header from '../../../components/Header';
import SubHeader from '../../../components/SubHeader';
import FormField from '../../../components/FormField/';
import formFieldStyles from '../../../components/FormField/styles';
import FormPicker from '../../../components/FormPicker/';
import { required } from '../../../shared/validations';
import {platformStyle} from "../../../theme";
import sharedStyles from '../../../shared/styles';
import waterfall from 'async/waterfall';
import generalService from '../../../services/general/generalService';
import Spinner from '../../../components/Spinner';
import PopupDialog from '../../../components/PopupDialog/';
import { NavigationActions } from 'react-navigation'
import TimerMixin from "react-timer-mixin";
import firebaseService from "../../../services/firebase/firebaseService";

const backAction = NavigationActions.back({
  key: null
});

class NewSuggestion extends Component {
  constructor( props ) {
    super(props);
    this.state = {
      spinnerVisible: false,
      type:null,
      description:null
    };
  }

  componentDidMount() {
    firebaseService.supervisorAnalytic('NEWSUGGESTION');

    this.props.selectAccount({idPaymentForm: repo.configuration.getField('idPaymentForm')});
  }

  onChangeType(value){
	  this.setState({type: value});
  }
  
  onChangeDescription(value){
	  this.setState({description: value});
  }
  
  submit( values ) {
	  
	  if(this.state.spinnerVisible){
		  return;
	  }
	  
	  this.setState({ spinnerVisible: true });
	  
	  generalService.postRccAction({ idAccount: values.idPaymentForm, text: values.description }, "question", function(err, result){
		  
		  this.setState({ spinnerVisible: false });
		 
		  if( !err ) {
			  this.showPopupAlert(I18n.t("INFO"), I18n.t("OPERATION_SUCCESS") + result.data.reference, {
				  1: {
					  key: 'button1',
					  text: `${I18n.t('accept')}`,
					  action: () => {
						  if(this.props.navigation.state.params.load){
							  this.props.navigation.state.params.load();
						  }
					  	this.props.navigation.dispatch(backAction);
					  },
					  align: ''
				  }
			  });
			  
		  } else {
              this.setState(err);
		  }

	  }.bind(this));

	  Keyboard.dismiss();

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
        <SubHeader text={I18n.t('NewSuggestion')} back {...this.props}/>
        <PopupDialog
          refModal={this.state.messageAlert}
        />
        <Content padderHorizontal>
          
	        <Field name="accountNumber"
	            validate={[ required ]}
	            component={( props ) =>
	              <View>
	                <Label style={formFieldStyles.inputLabel}>{I18n.t('Account')}</Label>
	                <Item error={props.meta.error && props.meta.touched}
	                      onPress={() => this.props.navigation.navigate('Accounts', {type: this.state.type, description: this.state.description})}
	                      style={{ height: platformStyle.inputHeightBase }}>
	                  <Text style={{
	                    fontSize: platformStyle.fontSizeLarge, fontFamily: platformStyle.fontFamilyBlack,
	                    color: props.input.value ? platformStyle.brandSecondary : platformStyle.inputBorderColor
	                  }}>
	                    {props.input.value || repo.configuration.getField('accountNumber') || '...'}
	                  </Text>
	                </Item>
	                <View style={formFieldStyles.labelError}>
	                  <Text
	                    style={props.meta.touched && props.meta.error ? formFieldStyles.formErrorText1 : formFieldStyles.formErrorText2}>
	                    {props.meta.error || 'error here'}
	                  </Text>
	                </View>
	              </View>
	            }
	        />
        
        	<Input name="idPaymentForm"
	        	keyboardType="numeric"
	        	style={{ height: 0 }}
            />
          
	        <Field name="description"
                 component={FormField}
                 errorActive
                 inputLabel={I18n.t('YOUR_SUGGES')}
          		 onChange={this.onChangeDescription.bind(this)}
                 validate={[ required ]}
                 underline
                 light
                 multiline
                 height={70}
                 inputProps={{
                   numberOfLines: 3
                 }}
	        />

          {platformStyle.platform === 'ios' ?
            <Button block rounded style={{ backgroundColor: platformStyle.brandPrimary}} onPress={this.props.handleSubmit(this.submit.bind(this))}
                    style={sharedStyles.margin('top')}
            >
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

const NewSuggestionForm = reduxForm({
  form: "SuggestionForm",
  enableReinitialize: true,
})(NewSuggestion);

const mapStateToProps = state => {
  const accounts = JSON.parse(repo.configuration.getField('accountListAction')) || [];

  let account = state.generalReducer.selectAccount.accountNumber ? state.generalReducer.selectAccount.accountNumber : repo.configuration.getField('accountNumber');
  
  return ({
    initialValues: {
      accountNumber: account,
      idPaymentForm: accounts.length === 1 ? accounts[ 0 ].idPaymentForm : state.generalReducer.selectAccount.idPaymentForm,
      type: state.generalReducer.selectAccount.type,
      description: state.generalReducer.selectAccount.description,
    }
  })
};

const bindAction = dispatch => {
  return {
    selectAccount: ( account ) => dispatch(selectAccount(account)),
  };
};

export default connect(mapStateToProps, bindAction)(NewSuggestionForm);

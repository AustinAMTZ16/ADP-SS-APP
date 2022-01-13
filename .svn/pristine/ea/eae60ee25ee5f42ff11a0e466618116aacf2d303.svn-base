import React, { Component } from "react";
import { Container, Content, Button, Text } from "native-base";
import { Field, reduxForm } from "redux-form";
import { connect } from 'react-redux';
import { logInRedux } from '../../actions/security';

import FormPicker from '../../components/FormPicker/';
import Header from '../../components/Header/';
import SubHeader from '../../components/SubHeader';
import sharedStyles from '../../shared/styles';
import I18n from 'react-native-i18n';
import Spinner from 'react-native-loading-spinner-overlay';
import repo from "../../services/database/repository";
import PopupDialog from '../../components/PopupDialog/';
import { NavigationActions } from 'react-navigation';
import * as availableLanguages from '../../services/i18n/lan';
import { loadDataFormLanguage } from '../../actions/general';
import {getDeviceCountry, changeLanguage} from "../../services/i18n/index";
import generalService from '../../services/general/generalService'

const backAction = NavigationActions.back({
  key: null
});

class ChangeLanguage extends Component {
	
  constructor() {
    super();
    this.state = {
      spinnerVisible: false,
      langs:[]
    }
  }

  getLangs(){
	  return _.map(availableLanguages, function( item, index ) {
	        return { code: index, val: I18n.t('LANG_' + index.toUpperCase()) }
	  });
  }
  
  componentDidMount() {
    let langs = this.getLangs();
    this.setState({
    	langs
    }, function() {
        this.props.loadDataFormLanguage({lang: repo.configuration.getField("language")});
    }.bind(this));
  }

  submit( values ) {
	  var me = this;
	  if(values.lang){
		   me.setState({ spinnerVisible: true });
		   let country = getDeviceCountry();
		   changeLanguage(values.lang + "-" + country);
		   
		   //There are some data wich comes translated, delete it
		   repo.configuration.setField('accountListAction', "{}");
	
	       generalService.listDataAction(function(){
			   let langs = this.getLangs();
	    	   me.setState({ spinnerVisible: false, langs });	    	   
	       }.bind(this));
	  }
  }

  componentWillUnmount() {
    this.setState({ spinnerVisible: false });
  }

  /**
   *
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
        }
      }
    })
  }


  render() {
    return (
      <Container>
        <Header {...this.props} noDrawer
                iconAction={'ios-home-outline'}
        />
        <SubHeader text={I18n.t('CHANGE_LANGUAGE')} back={true} {...this.props}
        />
        <PopupDialog
          refModal={this.state.messageAlert}
        />
        <Content padderHorizontal>
          <Field name="lang"
              component={FormPicker}
              validationActive
              noSelect={true}
              inputLabel={I18n.t('CHANGE_LANGUAGE')}
              borderBottomStyle
              errorActive
              dataItems={this.state.langs.length ? this.state.langs : null}
              inputProps={{
                returnKeyType: 'next',
                ref: c => (this.lang = c)
              }}
          />


          <Button full rounded style={sharedStyles.margin('top')}
                  onPress={this.props.handleSubmit(this.submit.bind(this))}>
            <Text>{I18n.t('Submit')}</Text>
          </Button>
        </Content>

        <Spinner visible={this.state.spinnerVisible} textContent="..."/>
      </Container>
    );
  }
}

const ChangeLanguageView = reduxForm({
  form: "ChangeLanguageForm",
  enableReinitialize: true
})(ChangeLanguage);


function bindAction( dispatch ) {
  return {
    logInRedux: () => dispatch(logInRedux()),
    loadDataFormLanguage: ( formData ) => dispatch(loadDataFormLanguage(formData)),
  };
}
const mapStateToProps = state => {
  return {
    initialValues: state.generalReducer.formDataLanguage
  }
};
export default connect (mapStateToProps,bindAction)(ChangeLanguageView);